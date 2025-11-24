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
  useContractRead,
  useContractWrite,
  useNetwork,
  usePublicClient,
  useSendTransaction,
  useSwitchNetwork,
} from 'wagmi';

import { TokensList } from './tokens-list';

import { DropdownTradeButton } from '../../ui/dropdown-btn';
import { InteractionInfo } from '../../ui/interaction-info';
import RiskManagement from '../risk-management';

import { earnPoolCheckerAbi } from '@/abi/earn/EarnPoolCheckerAbi';
import { type CubeWithApyAndTvl } from '@/actions/get-all-cubes';
import { type TokensByName } from '@/actions/get-all-tokens';
import { ConnectWalletButton } from '@/components/connect-wallet-button';
import { SlippageModal } from '@/components/slippage-modal';
import { Input } from '@/components/vault/trade/ui/input';
import { stopLossesLabels, StopLossValue } from '@/constants/earn-details';
import { DEFAULT_DEPOSIT_SLIPPAGE } from '@/constants/slippage';
import { useCubeTokensBalances } from '@/hooks/useCubeTokensBalances';
import { apiChainToWagmi } from '@/lib/api-chain-to-wagmi';
import { depositEarn } from '@/lib/earn/deposit-earn';
import { isNativeToken } from '@/lib/is-native-token';
import { Button } from '@/ui/button';
import { Collapsible, CollapsibleContent } from '@/ui/collapsible';
import { useToast } from '@/ui/use-toast';

export type DepositProps = {
  cube: CubeWithApyAndTvl;
  tokens: TokensByName;
  selectedToken: string;
  setSelectedToken: Dispatch<SetStateAction<string>>;
};

type EarnZapsData = Awaited<ReturnType<typeof depositEarn>>;

export const EarnDeposit = ({
  cube,
  tokens,
  selectedToken,
  setSelectedToken,
}: DepositProps) => {
  const chainVault = apiChainToWagmi(cube.network);
  const chainId = chainVault.id;

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isZapsLoading, setIsZapsLoading] = useState<boolean>(false);
  const [zapsData, setZapsData] = useState<EarnZapsData | null>(null);
  const [isCollapsibleOpen, setIsCollapsibleOpen] = useState(false);
  const [activeRiskOption, setActiveRiskOption] = useState<StopLossValue>(
    StopLossValue.NONE,
  );
  const [slippageValue, setSlippageValue] = useState<number>(
    DEFAULT_DEPOSIT_SLIPPAGE,
  );

  const stopLosses = useMemo(
    () =>
      cube.stopLosses.map((s, index) => ({
        id: index,
        value: s,
      })),
    [cube.stopLosses],
  );

  const { toast } = useToast();
  const { chain } = useNetwork();
  const isMounted = useIsMounted();
  const { isConnected, address } = useAccount();
  const publicClient = usePublicClient({ chainId });
  const { switchNetworkAsync } = useSwitchNetwork({ chainId });
  const [amountToDepositInput, setAmountToDeposit] = useState(0);
  const earnAddress = cube.earn as `0x${string}`;
  const [amountToDeposit] = useDebounce(amountToDepositInput, 1000);
  const [isUserEditing, setIsUserEditing] = useState(false);

  const displaySelectedToken = selectedToken;

  const vaultBalances = useCubeTokensBalances(cube, tokens);
  const selectedVaultToken = useMemo(
    () => vaultBalances.find((balance) => balance.symbol === selectedToken),
    [selectedToken, vaultBalances],
  );
  const onCollapsibleValueChange = useCallback(
    (value: string) => {
      setIsCollapsibleOpen(false);
      setSelectedToken(value);
      setIsUserEditing(false); // Сброс при смене токена
    },
    [setSelectedToken],
  );

  const { data: stableReceived } = useContractRead({
    abi: earnPoolCheckerAbi,
    address: cube.gelatoChecker as Address,
    // todo: why is this not working?
    // @ts-expect-error Type 'string' is not assignable to type 'undefined'
    functionName: 'stableReceivedStopLoss',
    args: address ? [cube.earn as Address, address] : undefined,
    chainId: apiChainToWagmi(cube.network).id,
    watch: true,
  });
  const positionCost = stableReceived ? stableReceived[0] : BigInt(0);

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

  const parsedBalance = useMemo(() => {
    if (!selectedVaultToken) return 0;
    const fullBalance = +formatUnits(
      selectedVaultToken.balance,
      selectedVaultToken.decimals,
    );
    // ❗ ВСЕГДА округляем до 6 знаков!
    return Math.floor(fullBalance * 1000000) / 1000000;
  }, [selectedVaultToken]);

  const onMaxClick = useCallback(() => {
    const maxValue = parseFloat(
      formatUnits(
        selectedVaultToken?.balance ?? BigInt(0),
        selectedVaultToken?.decimals ?? 18,
      ),
    );
    // Округлить до 6 знаков после запятой
    const roundedValue = Math.floor(maxValue * 1000000) / 1000000;
    setAmountToDeposit(roundedValue);
    setIsUserEditing(true); // MAX тоже считается редактированием
  }, [selectedVaultToken]);

  // Автоматически выбрать токен с приоритетом: стейблкоин > 1 → ETH → остальные стейблкоины → максимальный баланс
  useEffect(() => {
    if (!isConnected || !address || vaultBalances.length === 0) {
      return;
    }

    const stablecoins = ['USDT', 'USDC', 'DAI', 'USDC.E', 'USDBC', 'BUSD', 'SUSD'];
    const nativeTokens = ['ETH', 'WETH', 'BNB', 'WBNB', 'MATIC', 'WMATIC'];

    let selectedTokenToUse = null;

    // 1. ПРИОРИТЕТ: Если есть стейблкоин с балансом > 1, выбираем его
    const stablecoinWithBalance = vaultBalances.find((token) => {
      const isStablecoin = stablecoins.some((sc) => 
        token.symbol.toUpperCase().includes(sc)
      );
      if (!isStablecoin) return false;
      
      const balance = parseFloat(
        formatUnits(token.balance, token.decimals ?? 18),
      );
      return balance > 1;
    });

    if (stablecoinWithBalance) {
      selectedTokenToUse = stablecoinWithBalance;
    } else {
      // 2. Если нет стейблкоина > 1, приоритет - нативные токены (ETH, BNB и т.д.)
      const nativeToken = vaultBalances.find((token) =>
        nativeTokens.some((nt) => token.symbol.toUpperCase().includes(nt)),
      );

      if (nativeToken && nativeToken.balance > 0n) {
        selectedTokenToUse = nativeToken;
      } else {
        // 3. Если нет ETH - ищем любой стейблкоин с балансом > 0
        const anyStablecoin = vaultBalances.find((token) =>
          stablecoins.some((sc) => token.symbol.toUpperCase().includes(sc)) &&
          token.balance > 0n
        );

        if (anyStablecoin) {
          selectedTokenToUse = anyStablecoin;
        } else {
          // 4. Если ничего нет - берем токен с максимальным балансом
          selectedTokenToUse = vaultBalances.reduce((max, current) => {
            if (current.balance === 0n) return max;
            const maxBalance = parseFloat(
              formatUnits(max.balance, max.decimals ?? 18),
            );
            const currentBalance = parseFloat(
              formatUnits(current.balance, current.decimals ?? 18),
            );
            return currentBalance > maxBalance ? current : max;
          });
        }
      }
    }

    if (selectedTokenToUse && selectedTokenToUse.balance > 0n) {
      const balanceValue = parseFloat(
        formatUnits(
          selectedTokenToUse.balance,
          selectedTokenToUse.decimals ?? 18,
        ),
      );

      // Установить выбранный токен
      if (selectedTokenToUse.symbol !== selectedToken) {
        setSelectedToken(selectedTokenToUse.symbol);
        setIsUserEditing(false); // Сброс при смене токена
      }

      // Заполнить поле ТОЛЬКО если пользователь НЕ редактирует
      if (balanceValue > 0 && !isUserEditing) {
        // Округлить до 6 знаков после запятой
        const roundedValue = Math.floor(balanceValue * 1000000) / 1000000;
        setAmountToDeposit(roundedValue);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConnected, address, vaultBalances, isUserEditing]);

  const onDepositInputChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      // Пользователь начал редактировать - больше не автозаполнять
      setIsUserEditing(true);
      setIsZapsLoading(true);
      let value = parseFloat(e.target.value);
      if (isNaN(value)) {
        return setAmountToDeposit(0);
      }

      // Ограничить до 6 знаков после запятой
      value = Math.floor(value * 1000000) / 1000000;

      if (selectedVaultToken) {
        if (value > parsedBalance) {
          // parsedBalance уже округлен до 6 знаков в useMemo
          value = parsedBalance;
        }
      }

      return setAmountToDeposit(value);
    },
    [selectedVaultToken, parsedBalance],
  );

  const { sendTransactionAsync: sendZapAsync } = useSendTransaction({
    to: cube.earn && zapsData?.calldata ? (cube.earn as Address) : undefined,
    data: zapsData?.calldata,
    value: zapsData?.value,
  });

  const approve = useCallback(async () => {
    try {
      const { hash } = await approveAsync({
        to: selectedVaultToken?.address as Address,
        args: [
          earnAddress,
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
    earnAddress,
  ]);

  const onButtonClick = useCallback(async () => {
    if (isLoading) {
      return;
    }
    if (isAllowanceEnough && (!sendZapAsync || !zapsData?.calldata || !cube.earn)) {
      toast({
        variant: 'destructive',
        title: 'Transaction data is not ready.',
        description: 'Please wait a moment and try again.',
      });
      return;
    }
    setIsLoading(true);
    try {
      const hash = await (isAllowanceEnough ? sendZapAsync : approve)();
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
    sendZapAsync,
    approve,
    publicClient,
    toast,
    zapsData?.calldata,
    cube.earn,
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
        !address ||
        !cube.zapConfig ||
        !amountToDeposit
      ) {
        return setZapsData(null);
      }

      setIsZapsLoading(true);

      const stopLoss = stopLosses.find(
        (s) => s.id === stopLossesLabels[activeRiskOption].id,
      );

      setZapsData(
        await depositEarn({
          cube,
          provider: publicClient,
          tokenInAmount: parseUnits(
            amountToDeposit.toString().replace(',', '.'),
            selectedVaultToken.decimals,
          ),
          depositETH: selectedVaultToken.isNative,
          tokenIn: selectedVaultToken.address as Address,
          tokenTo: cube.stableAddress as Address,
          slippage: parseUnits(slippageValue.toString().replace(',', '.'), 18),
          // TODO: rework
          stopLossCostPercents: stopLoss ? 100 - stopLoss.value : 0,
          userAddress: address,
          positionCost,
        }),
      );
    }

    loadZapsData()
      .catch((error) => {
        console.error('[EarnDeposit] Error loading zap data:', error);
        setZapsData(null);
        
        // Show user-friendly error messages
        if (error instanceof Error) {
          const errorMessage = error.message;
          
          if (errorMessage.includes('too small')) {
            toast({
              variant: 'destructive',
              title: 'Amount Too Small',
              description: errorMessage,
            });
          } else if (errorMessage.includes('insufficient liquidity')) {
            toast({
              variant: 'destructive',
              title: 'Insufficient Liquidity',
              description: errorMessage,
            });
          } else if (errorMessage.includes('1inch') || errorMessage.includes('unavailable')) {
            toast({
              variant: 'destructive',
              title: '1inch API Error',
              description: errorMessage.includes('rate limits') || errorMessage.includes('unavailable')
                ? '1inch API is temporarily unavailable. Please try using the stable token directly or try again later.'
                : errorMessage,
            });
          } else if (errorMessage.includes('IntegerOutOfRange')) {
            toast({
              variant: 'destructive',
              title: 'Invalid Amount',
              description: 'The calculated amount is invalid. Please adjust your deposit amount or disable stop-loss.',
            });
          }
        }
      })
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
    address,
    cube,
    amountToDeposit,
    publicClient,
    stopLosses,
    positionCost,
    activeRiskOption,
    slippageValue,
    toast,
  ]);

  useEffect(() => {
    const unsubscribe = handleRefresh();

    return () => {
      unsubscribe();
    };
  }, [handleRefresh]);

  const handleRiskClick = (value: StopLossValue) => {
    setActiveRiskOption(value);
  };

  return (
    <div className="flex flex-col gap-[16px] rounded-b-[12px] rounded-tr-[12px] bg-white bg-opacity-11 p-[16px]">
      <Collapsible className="flex flex-col gap-4" open={isCollapsibleOpen}>
        <div className="rounded-[8px] bg-transparent-bg-dark shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] backdrop-blur-[10px]">
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
                  6,
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
                zapsSupported={true}
                open={isCollapsibleOpen}
                setOpen={setIsCollapsibleOpen}
              />
            </div>
          </div>
        </div>
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
      </Collapsible>
      <RiskManagement
        stopLossesPercents={stopLosses}
        activeOption={activeRiskOption}
        onClick={handleRiskClick}
      />
      {isMounted && (
        <SlippageModal
          slippageValue={slippageValue}
          onSlippageChange={setSlippageValue}
        />
      )}
      <div className="flex flex-col gap-[16px]">
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
                isZapsLoading ||
                amountToDepositInput == 0 ||
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
      <InteractionInfo cube={cube} publicClient={publicClient} />
    </div>
  );
};
