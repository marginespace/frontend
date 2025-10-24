import { useIsMounted } from '@redduck/helpers-react';
import { formatBigIntComa } from '@redduck/helpers-viem';
import { Loader2 } from 'lucide-react';
import {
  type ChangeEvent,
  type Dispatch,
  type SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useDebounce } from 'use-debounce';
import { type Address, formatUnits, parseUnits } from 'viem';
import {
  erc20ABI,
  useAccount,
  useContractWrite,
  useNetwork,
  usePublicClient,
  useSendTransaction,
  useSwitchNetwork,
} from 'wagmi';

import { DropdownTradeButton } from '../ui/dropdown-btn';
import { TradeInfo } from '../ui/trade-info';

import { vaultV7Abi } from '@/abi/VaultV7';
import { type TokensByName } from '@/actions/get-all-tokens';
import { type VaultWithApyAndTvl } from '@/actions/get-all-vaults-with-apy-and-tvl';
import { ConnectWalletButton } from '@/components/connect-wallet-button';
import { SlippageModal } from '@/components/slippage-modal';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent } from '@/components/ui/collapsible';
import { useToast } from '@/components/ui/use-toast';
import { TokensList } from '@/components/vault/trade/deposit/tokens-list';
import { Input } from '@/components/vault/trade/ui/input';
import { DEFAULT_DEPOSIT_SLIPPAGE } from '@/constants/slippage';
import { useVaultTokensBalances } from '@/hooks/useVaultTokensBalances';
import { apiChainToWagmi } from '@/lib/api-chain-to-wagmi';
import { isNativeToken } from '@/lib/is-native-token';
import { getZapsData, type ZapsDataReturn } from '@/lib/zaps';

export type DepositProps = {
  vault: VaultWithApyAndTvl;
  tokens: TokensByName;
  selectedToken: string;
  setSelectedToken: Dispatch<SetStateAction<string>>;
};

export const DEFAULT_STABLE = 'USDC';

export const Deposit = ({
  vault,
  tokens,
  selectedToken,
  setSelectedToken,
}: DepositProps) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isZapsLoading, setIsZapsLoading] = useState(false);
  const isMounted = useIsMounted();
  const { isConnected, address } = useAccount();
  const vaultAddress = vault.earnContractAddress as `0x${string}`;
  const [amountToDepositInput, setAmountToDeposit] = useState(0);
  const [amountToDeposit] = useDebounce(amountToDepositInput, 1000);

  const chainVault = apiChainToWagmi(vault.chain);
  const chainId = chainVault.id;
  const publicClient = usePublicClient({ chainId });
  const { chain } = useNetwork();
  const { switchNetworkAsync } = useSwitchNetwork({ chainId });
  const [isCollapsibleOpen, setIsCollapsibleOpen] = useState(false);
  const [zapsData, setZapsData] = useState<ZapsDataReturn | null>(null);
  const [slippageValue, setSlippageValue] = useState<number>(
    DEFAULT_DEPOSIT_SLIPPAGE,
  );

  const displaySelectedToken = useMemo(() => selectedToken, [selectedToken]);

  const vaultBalances = useVaultTokensBalances(
    vault,
    tokens,
    zapsData?.zapsData.zapCalldata.to,
  );

  const selectedVaultToken = useMemo(
    () => vaultBalances.find((balance) => balance.symbol === selectedToken),
    [selectedToken, vaultBalances],
  );

  const onCollapsibleValueChange = useCallback(
    (value: string) => {
      setIsCollapsibleOpen(false);
      setSelectedToken(value);
    },
    [setSelectedToken],
  );
  const currentAllowance = parseFloat(
    formatUnits(
      selectedVaultToken?.allowance ?? BigInt(0),
      selectedVaultToken?.decimals ?? 18,
    ),
  );
  const isAllowanceEnough = isNativeToken(selectedVaultToken)
    ? true
    : currentAllowance >= amountToDepositInput;

  const { writeAsync: approveAsync } = useContractWrite({
    abi: erc20ABI,
    address: selectedVaultToken
      ? (selectedVaultToken.address as Address)
      : undefined,
    functionName: 'approve',
    chainId,
  });

  const { writeAsync: depositAsync } = useContractWrite({
    abi: vaultV7Abi,
    address: vaultAddress,
    functionName: 'deposit',
    chainId,
  });

  const parsedBalance = useMemo(() => {
    return selectedVaultToken
      ? +formatUnits(
          selectedVaultToken.balance ?? 0,
          selectedVaultToken.decimals ?? 18,
        )
      : 0;
  }, [selectedVaultToken]);

  const onMaxClick = useCallback(() => {
    setAmountToDeposit(
      parseFloat(
        formatUnits(
          selectedVaultToken?.balance ?? BigInt(0),
          selectedVaultToken?.decimals ?? 18,
        ),
      ),
    );
  }, [selectedVaultToken]);

  const onDepositInputChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setIsZapsLoading(true);
      let value = parseFloat(e.target.value);
      if (isNaN(value)) {
        return setAmountToDeposit(0);
      }

      if (selectedVaultToken) {
        if (value > parsedBalance) {
          value = parsedBalance;
        }
      }

      return setAmountToDeposit(value);
    },
    [selectedVaultToken, parsedBalance],
  );

  const { sendTransactionAsync: sendZapAsync } = useSendTransaction({
    to: zapsData?.zapsData.zapCalldata.to,
    data: zapsData?.zapsData.zapCalldata.calldata,
    value: zapsData?.zapsData.zapCalldata.value,
  });

  const approve = useCallback(async () => {
    try {
      const { hash } = await approveAsync({
        to: selectedVaultToken?.address as Address,
        args: [
          selectedVaultToken?.address === vault.tokenAddress
            ? vaultAddress
            : zapsData?.zapsData.zapCalldata.to ?? vaultAddress,
          parseUnits(
            amountToDepositInput.toString().replace(',', '.'),
            selectedVaultToken?.decimals ?? 18,
          ),
        ],
      });
      return hash;
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Error while approving.',
        description: 'Please try again later.',
      });
      return null;
    }
  }, [
    amountToDepositInput,
    approveAsync,
    selectedVaultToken,
    toast,
    vault.tokenAddress,
    vaultAddress,
    zapsData,
  ]);

  const deposit = useCallback(async () => {
    try {
      const { hash } = await depositAsync({
        args: [
          parseUnits(
            amountToDepositInput.toString().replace(',', '.'),
            selectedVaultToken?.decimals ?? 18,
          ),
        ],
      });
      return hash;
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Error while depositing.',
        description: 'Please try again later.',
      });
      return null;
    }
  }, [amountToDepositInput, selectedVaultToken, depositAsync, toast]);

  const onButtonClick = useCallback(async () => {
    if (isLoading) {
      return;
    }
    setIsLoading(true);
    try {
      const hash = await (isAllowanceEnough
        ? selectedVaultToken?.id === 'lp'
          ? deposit
          : sendZapAsync
        : approve)();
      if (!hash) {
        return;
      }
      await publicClient.waitForTransactionReceipt({
        hash: typeof hash === 'string' ? hash : hash.hash,
      });
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Error during transaction.',
        description: 'Please try again later.',
      });
    } finally {
      setIsLoading(false);
    }
  }, [
    isLoading,
    isAllowanceEnough,
    selectedVaultToken,
    deposit,
    sendZapAsync,
    approve,
    publicClient,
    toast,
  ]);

  const onSwitchNetworkClick = useCallback(async () => {
    setIsLoading(true);
    try {
      await switchNetworkAsync?.(chainId);
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
  }, [chainId, switchNetworkAsync, toast]);

  const handleRefresh = useCallback(() => {
    const abortController = new AbortController();

    async function loadZapsData() {
      if (
        !selectedVaultToken ||
        selectedVaultToken.address === vault.tokenAddress ||
        !address ||
        !vault.zapConfig ||
        !amountToDeposit
      ) {
        return setZapsData(null);
      }

      setIsZapsLoading(true);
      setZapsData(
        await getZapsData({
          from: address,
          token: selectedVaultToken.address as Address,
          isTokenNative: isNativeToken(selectedVaultToken),
          tokenAmount: parseUnits(
            amountToDeposit.toString().replace(',', '.'),
            selectedVaultToken.decimals,
          ),
          slippage: slippageValue,
          vault,
          zapConfig: vault.zapConfig,
          provider: publicClient,
          signal: abortController.signal,
          tokenMetadata: selectedVaultToken,
        }),
      );
    }

    loadZapsData()
      .catch(console.error)
      .finally(() => setIsZapsLoading(false));

    return () => {
      try {
        abortController.abort('Changed');
      } catch (error) {
        /* empty */
      }
    };
  }, [
    selectedVaultToken,
    vault,
    address,
    amountToDeposit,
    slippageValue,
    publicClient,
  ]);

  useEffect(() => {
    handleRefresh();
  }, [handleRefresh]);

  return (
    <div className="flex flex-col gap-[16px] rounded-b-[12px] rounded-tr-[12px] bg-white bg-opacity-11 p-[16px]">
      <Collapsible className="flex flex-col gap-4" open={isCollapsibleOpen}>
        <div className="rounded-[8px] bg-[rgba(53,40,82,0.43)] shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] backdrop-blur-[10px]">
          <div className="flex flex-col gap-[12px] p-[16px]">
            <div className="flex flex-row justify-between text-[14px] text-[#CFC9FF]">
              <div>
                Available:{' '}
                {formatBigIntComa(
                  isMounted && selectedVaultToken?.balance
                    ? selectedVaultToken.balance
                    : BigInt(0),
                  isMounted && selectedVaultToken?.decimals
                    ? selectedVaultToken.decimals
                    : 18,
                  2,
                )}
              </div>
              <div>Select token</div>
            </div>
            <div className="flex items-center gap-[16px]">
              <Button
                variant="outlined"
                className="h-[26px] text-[12px]"
                onClick={onMaxClick}
              >
                Max
              </Button>
              <Input
                id="deposit-input"
                className="w-full"
                placeholder="0"
                type="number"
                min={0}
                step={0.1}
                value={amountToDepositInput}
                onChange={onDepositInputChange}
              />
              <DropdownTradeButton
                selectedToken={displaySelectedToken}
                zapsSupported={vault.zapsSupported}
                open={isCollapsibleOpen}
                setIsOpen={setIsCollapsibleOpen}
              />
            </div>
          </div>
        </div>
        {vault.zapsSupported && (
          <CollapsibleContent asChild>
            <div className="flex flex-col gap-[12px]">
              <TokensList
                vaultBalances={vaultBalances}
                loading={isZapsLoading}
                onChange={onCollapsibleValueChange}
                onRefreshClick={handleRefresh}
                defaultToken={selectedToken}
              />
            </div>
          </CollapsibleContent>
        )}
      </Collapsible>
      {isMounted && (
        <SlippageModal
          slippageValue={slippageValue}
          onSlippageChange={setSlippageValue}
        />
      )}
      <div className="gap flex flex-col  gap-[16px]">
        <div>
          {isConnected && isMounted ? (
            chain?.id !== chainId ? (
              <Button
                variant="contained"
                disabled={isLoading}
                onClick={onSwitchNetworkClick}
                className="w-full"
              >
                {isLoading && (
                  <Loader2 className="mr-2 h-[20px] w-[20px] animate-spin" />
                )}
                Switch Network
              </Button>
            ) : (
              <Button
                onClick={onButtonClick}
                disabled={
                  isLoading ||
                  amountToDepositInput === 0 ||
                  isZapsLoading ||
                  amountToDeposit > parsedBalance
                }
                className="w-full"
                variant="contained"
              >
                {amountToDepositInput === 0 ? (
                  'Deposit'
                ) : isLoading || isZapsLoading ? (
                  <Loader2 className="h-8 w-8 animate-spin" />
                ) : zapsData && !isAllowanceEnough ? (
                  'Approve'
                ) : (
                  'Deposit'
                )}
              </Button>
            )
          ) : (
            <ConnectWalletButton />
          )}
        </div>
      </div>
      <TradeInfo vault={vault} publicClient={publicClient} />
    </div>
  );
};
