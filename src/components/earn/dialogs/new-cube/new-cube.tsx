'use client';

import * as Dialog from '@radix-ui/react-dialog';
import { watchContractEvent } from '@wagmi/core';
import { Loader2 } from 'lucide-react';
import {
  Fragment,
  useState,
  type ReactNode,
  useCallback,
  useEffect,
} from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { type Address, parseUnits } from 'viem';
import {
  useContractRead,
  useContractReads,
  useContractWrite,
  useWalletClient,
  erc20ABI,
  useAccount,
  useSwitchNetwork,
  useNetwork,
  usePublicClient,
} from 'wagmi';

import { EarnConfiguration } from '@/abi/EarnConfiguration';
import { EarnFactoryAbi } from '@/abi/EarnFactory';
import { type VaultWithApyAndTvl } from '@/actions/get-all-vaults-with-apy-and-tvl';
import { type ChainConfig } from '@/actions/get-chain-config';
import { saveEarnConfig } from '@/actions/save-earn-config';
import { SuccessAlert } from '@/components/alerts/success-alert';
import { Input } from '@/components/earn/dialogs/new-cube/ui/input';
import { Select } from '@/components/earn/dialogs/new-cube/ui/select';
import { CloseCube } from '@/components/ui/icons/closeCube';
import { useToast } from '@/components/ui/use-toast';
import { chainsById } from '@/constants/chainsById';
import { SUPPORTED_CHAINS } from '@/constants/supported-chains';
import { useAdmin } from '@/hooks/useAdmin';
import { apiChainToWagmi } from '@/lib/api-chain-to-wagmi';
import { signAuthMessage } from '@/lib/sign-auth-message';
import { Button } from '@/ui/button';

type Props = {
  children: ReactNode;
  configs: Record<string, ChainConfig>;
  vaults: VaultWithApyAndTvl[];
};

type FormValues = {
  cubeName: string;
  cubeDescription: string | undefined;
  vaults: string;
  network: string;
  low: string | undefined;
  medium: string | undefined;
  high: string | undefined;
  deposit: string | undefined;
  withdraw: string | undefined;
  autoswap: string | undefined;
  [x: string]: string | undefined;
};

export const NewCube = ({ children, configs, vaults }: Props) => {
  const [successOpen, setSuccessOpen] = useState<boolean>(false);
  const [isOpen, setOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(false);
  const [partsError, setPartsError] = useState(false);
  const { toast } = useToast();

  const { address } = useAccount();
  const isAdmin = useAdmin(address);
  const publicClient = usePublicClient();

  const { control, handleSubmit, setValue } = useForm<FormValues>();
  const vaultsValue = useWatch({ name: 'vaults', control });

  const selectedChain = useWatch({ name: 'network', control });
  const { switchNetworkAsync } = useSwitchNetwork({ chainId: +selectedChain });

  const [currentConfig, setCurrentConfig] = useState<ChainConfig>();

  const { chain } = useNetwork();

  const onSwitchNetworkClick = useCallback(async () => {
    setIsLoading(true);
    try {
      await switchNetworkAsync?.(+selectedChain);
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Error during switching network.',
        description: 'Please try again later.',
      });
    } finally {
      setIsLoading(false);
    }
  }, [selectedChain, switchNetworkAsync, toast]);

  useEffect(() => {
    const chain = vaultsValue?.length
      ? vaults.find((vault) => vault.id === vaultsValue.split(',')[0])?.chain
      : 'ethereum';

    setCurrentConfig(configs[chain || 'ethereum']);
  }, [selectedChain, vaultsValue, configs, vaults]);

  const { data: stableCoin } = useContractRead({
    abi: EarnConfiguration,
    address: currentConfig?.earnConfiguration as Address | undefined,
    enabled: !!currentConfig,
    functionName: 'stableToken',
  });

  const { data: stableData } = useContractReads({
    contracts: [
      {
        abi: erc20ABI,
        address: stableCoin as Address | undefined,
        functionName: 'decimals',
      },
      {
        abi: erc20ABI,
        address: stableCoin as Address | undefined,
        functionName: 'symbol',
      },
    ],
    enabled: Boolean(stableCoin),
  });

  const { writeAsync: createPoolAsync } = useContractWrite({
    abi: EarnFactoryAbi,
    functionName: 'deploy',
    address: currentConfig?.earnFactory as Address | undefined,
    chainId: Number(selectedChain),
  });

  const { data: walletClient } = useWalletClient();

  const handleAlert = () => {
    setSuccessOpen(true);
    setTimeout(() => setSuccessOpen(false), 3000);
  };

  const onSubmit = useCallback(
    async (data: FormValues) => {
      setIsLoading(true);
      setPartsError(false);

      try {
        if (
          !currentConfig ||
          !walletClient ||
          !stableData ||
          !data.network ||
          !data.cubeName ||
          !data.network ||
          !data.vaults
        )
          return;
        const submittedVaults: VaultWithApyAndTvl[] = data.vaults
          .split(',')
          .map((name: string) => {
            const vault = vaults.find((vault) => vault.id === name);
            return vault as VaultWithApyAndTvl;
          });

        const poolParts = submittedVaults.map(
          (vault) => data[vault.id] as string,
        );

        const risks = [
          Number(data.low || 5),
          Number(data.medium || 10),
          Number(data.high || 15),
        ];

        if (
          poolParts.reduce((accumulator, currentElement) => {
            return +accumulator + +currentElement;
          }, 0) === 100
        ) {
          await signAuthMessage(walletClient);

          const deployParams = [
            {
              _ac: currentConfig.ac ?? '',
              _earnConfiguration: currentConfig.earnConfiguration ?? '',
              _oneInchRouter: currentConfig.oneInchRouter ?? '',
              _wETH: currentConfig.wNative,
              _automate: currentConfig.gelatoAutomate,
              _resolver: currentConfig.earnGelatoChecker ?? '',
              _fees: {
                depositFee: data.deposit ? parseUnits(data.deposit, 18) : 0,
                withdrawalFee: data.withdraw
                  ? parseUnits(data.withdraw, 18)
                  : 0,
              },
            },
            submittedVaults.map((vault, index) => {
              return {
                poolPart: parseUnits(poolParts[index], 18),
                vault: vault.earnContractAddress,
              };
            }),
          ];

          const deployResult = await createPoolAsync({
            args: [...deployParams],
          });
          console.log('Deploy result:', deployResult);

          // Альтернативный подход: получаем адрес из transaction receipt
          try {
            const receipt = await publicClient.waitForTransactionReceipt({
              hash: deployResult.hash,
            });

            console.log('Transaction receipt logs:', receipt.logs);

            // Ищем адрес развернутого контракта в логах
            let earnAddress: Address | null = null;

            for (const log of receipt.logs) {
              console.log('Log:', log);
              // Проверяем разные варианты топиков событий
              if (
                log.topics[0] ===
                '0xa1459dea2f8e695f5edc1cd22622c3dfae6e06840e597f1eecbdf843c1386c30'
              ) {
                // Это событие из логов, которое вы показали
                earnAddress = `0x${log.topics[1]?.slice(-40)}` as Address;
                console.log(
                  'Found earn address from unknown event:',
                  earnAddress,
                );
                break;
              }
            }

            if (earnAddress) {
              console.log('Processing with found address:', earnAddress);
              setIsLoading(true);
              const res = await saveEarnConfig(
                {
                  gelatoChecker: currentConfig.earnGelatoChecker,
                  priceAggregator: currentConfig.earnPriceAggregator,
                  configuration: currentConfig.earnConfiguration,
                  earnHelper: currentConfig.earnHelper,
                  reservedForAutomation: 100,
                  network: submittedVaults[0].chain,
                  vaults: submittedVaults.map((vault, index) => {
                    return {
                      vaultId: vault.id,
                      part: +poolParts[index],
                    };
                  }),
                  risks: [],
                  createdAt: Math.floor(new Date().getTime() / 1000),
                  earnConfiguration: currentConfig.earnConfiguration,
                  stableAddress: stableCoin as Address,
                  stableDecimals: stableData[0].result as number,
                  stable: stableData[1].result as string,
                  stopLosses: risks,
                  id: `earn-${submittedVaults
                    .map((vault) => vault.id)
                    .join('-')}`,
                  name: data.cubeName,
                  description: data.cubeDescription,
                  earn: earnAddress, // Используем найденный адрес
                  autoswapFee: Number(data.autoswap || 0),
                },
                walletClient,
              );

              if (res && res.status === 201) {
                setIsLoading(false);
                handleAlert();
              } else {
                setIsLoading(false);
                toast({
                  variant: 'destructive',
                  title: 'Failed to create Strategy.',
                  description: 'Try again.',
                });
              }
              return;
            }
          } catch (error) {
            console.error('Error getting receipt:', error);
          }

          // Fallback: пробуем слушать событие EarnDeployed
          watchContractEvent(
            {
              eventName: 'EarnDeployed',
              chainId: +selectedChain,
              address: currentConfig?.earnFactory as Address | undefined,
              abi: EarnFactoryAbi,
            },
            async (log: any[]) => {
              console.log('EarnDeployed event received:', log);
              setIsLoading(true);
              const res = await saveEarnConfig(
                {
                  gelatoChecker: currentConfig.earnGelatoChecker,
                  priceAggregator: currentConfig.earnPriceAggregator,
                  configuration: currentConfig.earnConfiguration,
                  earnHelper: currentConfig.earnHelper,
                  reservedForAutomation: 100,
                  network: submittedVaults[0].chain,
                  vaults: submittedVaults.map((vault, index) => {
                    return {
                      vaultId: vault.id,
                      part: +poolParts[index],
                    };
                  }),
                  risks: [],
                  createdAt: Math.floor(new Date().getTime() / 1000),
                  earnConfiguration: currentConfig.earnConfiguration,
                  stableAddress: stableCoin as Address,
                  stableDecimals: stableData[0].result as number,
                  stable: stableData[1].result as string,
                  stopLosses: risks,
                  id: `earn-${submittedVaults
                    .map((vault) => vault.id)
                    .join('-')}`,
                  name: data.cubeName,
                  description: data.cubeDescription,
                  earn: log[0].args.earn,
                  autoswapFee: Number(data.autoswap || 0),
                },
                walletClient,
              );
              if (res && res.status === 201) {
                setIsLoading(false);
                handleAlert();
              } else {
                setIsLoading(false);
                toast({
                  variant: 'destructive',
                  title: 'Failed to create Strategy',
                  description: 'Try again.',
                });
              }
              return;
            },
          );
        } else {
          setPartsError(true);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    },
    [
      currentConfig,
      vaults,
      toast,
      createPoolAsync,
      selectedChain,
      stableCoin,
      stableData,
      walletClient,
      publicClient,
    ],
  );

  const onAutoBalanceClick = useCallback(() => {
    const partsCount = vaultsValue.split(',').length;
    const balancedValue = String(Math.floor(100 / partsCount));
    const remainder = 100 % partsCount;

    vaultsValue.split(',').forEach((name, i) => {
      if (i === partsCount - 1) {
        setValue(name, String(+balancedValue + remainder));
      } else {
        setValue(name, balancedValue);
      }
    });
  }, [setValue, vaultsValue]);

  return (
    <Dialog.Root open={isOpen} onOpenChange={setOpen}>
      <SuccessAlert open={successOpen}>Strategy successfully created.</SuccessAlert>
      {isAdmin && <div onClick={() => setOpen(true)}>{children}</div>}
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-[#29305666] backdrop-blur-[10px]" />
        <Dialog.Content className="fixed inset-0 flex flex-col items-center justify-center">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="fixed flex h-full max-h-[800px] w-full max-w-[545px] flex-col gap-[16px] overflow-y-scroll rounded-[20px] bg-[#272536] p-[24px]"
          >
            <div className="text-[24px] font-semibold text-white">
              Create a new strategy
            </div>
            <Controller
              control={control}
              render={({ field }) => (
                <Input
                  required
                  className="bg-[#3E3C4B]"
                  {...field}
                  placeholder="strategy name"
                />
              )}
              name="cubeName"
            />
            <Controller
              control={control}
              render={({ field }) => (
                <Input
                  className="bg-[#3E3C4B]"
                  {...field}
                  placeholder="Strategy description"
                />
              )}
              name="cubeDescription"
            />
            <Controller
              name="network"
              control={control}
              render={({ field }) => (
                <Select
                  placeholder="Select network"
                  {...field}
                  required
                  options={SUPPORTED_CHAINS.map((chain) => {
                    return {
                      value: chain.id.toString(),
                      name: chain.name,
                      icon: chainsById[chain.id],
                    };
                  })}
                />
              )}
            />
            <Controller
              name="vaults"
              control={control}
              render={({ field }) => (
                <Select
                  required
                  {...field}
                  isMulti
                  placeholder="Search Vault"
                  options={vaults
                    .filter((vault) => {
                      return !selectedChain
                        ? true
                        : apiChainToWagmi(vault.chain).id.toString() ===
                            selectedChain;
                    })
                    .map((vault) => {
                      return {
                        value: vault.id,
                        icon: chainsById[apiChainToWagmi(vault.chain).id],
                        description: vault.platformId.toUpperCase(),
                        name: vault.name,
                      };
                    })}
                />
              )}
            />
            {!!vaultsValue?.length && (
              <Fragment>
                <div className="flex flex-col gap-[4px]">
                  {vaultsValue.split(',').map((name, index) => {
                    const vault = vaults.find((vault) => vault.id === name);

                    return (
                      <div key={index} className="flex flex-row items-center">
                        <div className="w-1/2 truncate">{vault?.name}</div>
                        <div className="w-1/4 truncate">
                          {vault?.platformId.toUpperCase()}
                        </div>
                        <Controller
                          control={control}
                          render={({ field }) => (
                            <Input
                              type="number"
                              {...field}
                              required
                              min={0}
                              max={100}
                              placeholder={
                                (100 / vaultsValue.split(',').length)
                                  .toFixed(2)
                                  .toString() + '%'
                              }
                              className="w-1/4 rounded-[8px] bg-[#ffffff1c] px-[16px] py-[7px] text-center"
                            />
                          )}
                          name={name}
                        />
                      </div>
                    );
                  })}
                </div>
                {partsError && (
                  <div className="text-red-600">
                    Please make sure sum of all parts is 100
                  </div>
                )}
                <Button
                  type="button"
                  onClick={onAutoBalanceClick}
                  variant="transparent"
                  className="bg-[#272536]"
                >
                  Auto balance
                </Button>
              </Fragment>
            )}
            <div className="border-t-[1px] border-dashed border-[#C6C6CC]" />
            <div>Set up Risk Management options:</div>
            <div className="flex flex-col items-center gap-[8px]">
              <div className="flex w-full flex-row items-center justify-between">
                <div className="text-[#59B38A]">Low</div>
                <Controller
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      type="number"
                      placeholder="5%"
                      className="w-[138px] text-center"
                    />
                  )}
                  name="low"
                />
              </div>
              <div className="flex w-full flex-row items-center justify-between">
                <div className="text-[#E9C268]">Medium</div>
                <Controller
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      type="number"
                      placeholder="10%"
                      className="w-[138px] text-center"
                    />
                  )}
                  name="medium"
                />
              </div>
              <div className="flex w-full flex-row items-center justify-between">
                <div className="text-[#D85F5A]">High</div>
                <Controller
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      type="number"
                      placeholder="15%"
                      className="w-[138px] text-center"
                    />
                  )}
                  name="high"
                />
              </div>
            </div>
            <div>Set up deposit/withdraw commission:</div>
            <div className="flex flex-col items-center gap-[8px]">
              <div className="flex w-full flex-row items-center justify-between">
                <div>Deposit</div>
                <Controller
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      type="number"
                      placeholder="0%"
                      className="w-[138px] text-center"
                    />
                  )}
                  name="deposit"
                />
              </div>
              <div className="flex w-full flex-row items-center justify-between">
                <div>Withdraw</div>
                <Controller
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      type="number"
                      placeholder="0%"
                      className="w-[138px] text-center"
                    />
                  )}
                  name="withdraw"
                />
              </div>
            </div>
            <div>Set autoswap commission:</div>
            <div className="flex flex-col items-center gap-[8px]">
              <div className="flex w-full flex-row items-center justify-between">
                <div>Autoswap</div>
                <Controller
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      type="number"
                      placeholder="0%"
                      className="w-[138px] text-center"
                    />
                  )}
                  name="autoswap"
                />
              </div>
            </div>
            {chain?.id === +selectedChain ? (
              <Button
                disabled={isLoading}
                type="submit"
                className="flex items-center gap-2"
                variant="contained"
              >
                {isLoading && (
                  <Loader2 className="mr-2 h-[20px] w-[20px] animate-spin" />
                )}
                Create Strategy
              </Button>
            ) : (
              <Button
                disabled={isLoading}
                onClick={onSwitchNetworkClick}
                className="flex items-center gap-2"
                variant="contained"
              >
                {isLoading && (
                  <Loader2 className="mr-2 h-[20px] w-[20px] animate-spin" />
                )}
                Switch network
              </Button>
            )}

            <Dialog.Close className="absolute right-[16px] top-[16px]">
              <CloseCube />
            </Dialog.Close>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
