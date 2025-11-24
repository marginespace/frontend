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
  useAccount,
  useContractRead,
  useNetwork,
  usePublicClient,
  useSendTransaction,
  useSwitchNetwork,
} from 'wagmi';

import { WithdrawTokensList } from './withdraw-tokens-list';

import { DropdownTradeButton } from '../../ui/dropdown-btn';
import { InteractionInfo } from '../../ui/interaction-info';

import { earnAbi } from '@/abi/earn/EarnAbi';
import { earnPoolCheckerAbi } from '@/abi/earn/EarnPoolCheckerAbi';
import { type CubeWithApyAndTvl } from '@/actions/get-all-cubes';
import { type TokensByName } from '@/actions/get-all-tokens';
import { ConnectWalletButton } from '@/components/connect-wallet-button';
import { SlippageModal } from '@/components/slippage-modal';
import { Collapsible, CollapsibleContent } from '@/components/ui/collapsible';
import { Input } from '@/components/vault/trade/ui/input';
import { DEFAULT_WITHDRAW_SLIPPAGE } from '@/constants/slippage';
import { useCubeTokensWithdraw } from '@/hooks/useCubeTokensWithdraw';
import { apiChainToWagmi } from '@/lib/api-chain-to-wagmi';
import { withdrawEarn } from '@/lib/earn/withdraw-earn';
import { Button } from '@/ui/button';
import { useToast } from '@/ui/use-toast';

export type WithdrawProps = {
  cube: CubeWithApyAndTvl;
  tokens: TokensByName;
  selectedToken: string;
  setSelectedToken: Dispatch<SetStateAction<string>>;
};

type EarnWithdrawZapsData = Awaited<ReturnType<typeof withdrawEarn>>;

export const EarnWithdraw = ({
  cube,
  tokens,
  selectedToken,
  setSelectedToken,
}: WithdrawProps) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isZapsLoading, setIsZapsLoading] = useState(false);
  const isMounted = useIsMounted();
  const { isConnected, address } = useAccount();
  const [amountToWithdrawInput, setAmountToWithdraw] = useState(0);
  const [amountToWithdraw] = useDebounce(amountToWithdrawInput, 1000);
  const [isUserEditing, setIsUserEditing] = useState(false);
  const chainVault = apiChainToWagmi(cube.network);
  const chainId = chainVault.id;
  const publicClient = usePublicClient({ chainId });
  const { chain } = useNetwork();
  const { switchNetworkAsync } = useSwitchNetwork({ chainId });
  const [isCollapsibleOpen, setIsCollapsibleOpen] = useState(false);
  const [zapsData, setZapsData] = useState<EarnWithdrawZapsData | null>(null);
  const [slippageValue, setSlippageValue] = useState<number>(
    DEFAULT_WITHDRAW_SLIPPAGE,
  );

  const displaySelectedToken = selectedToken;
  const vaultTokens = useCubeTokensWithdraw(cube, tokens);
  const selectedVaultToken = useMemo(
    () => vaultTokens.find((token) => token.symbol === selectedToken),
    [selectedToken, vaultTokens],
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
  const { data: position } = useContractRead({
    abi: earnAbi,
    address: cube.earn as Address,
    functionName: 'positions',
    args: address ? [address] : undefined,
    chainId: apiChainToWagmi(cube.network).id,
    watch: true,
  });

  const positionCost = stableReceived ? stableReceived[0] : BigInt(0);
  const available = stableReceived ? stableReceived[1] : BigInt(0);

  const availableParsed = useMemo(() => {
    const fullBalance = parseFloat(formatUnits(available ?? BigInt(0), 18));
    // ❗ ВСЕГДА округляем до 6 знаков!
    return Math.floor(fullBalance * 1000000) / 1000000;
  }, [available]);
  const positionCostParsed = useMemo(() => {
    const fullBalance = parseFloat(formatUnits(positionCost ?? BigInt(0), 18));
    // ❗ ВСЕГДА округляем до 6 знаков!
    return Math.floor(fullBalance * 1000000) / 1000000;
  }, [positionCost]);

  const onMaxClick = useCallback(() => {
    // positionCostParsed уже округлен до 6 знаков в useMemo
    setAmountToWithdraw(positionCostParsed);
    setIsUserEditing(true); // MAX тоже считается редактированием
  }, [positionCostParsed]);

  const onWithdrawInputChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      // Пользователь начал редактировать
      setIsUserEditing(true);
      setIsZapsLoading(true);
      let value = parseFloat(e.target.value);
      if (isNaN(value)) {
        return setAmountToWithdraw(0);
      }

      // Ограничить до 6 знаков после запятой
      value = Math.floor(value * 1000000) / 1000000;

      if (availableParsed) {
        const parsedBalance = availableParsed;

        if (value > parsedBalance) {
          // availableParsed уже округлен до 6 знаков в useMemo
          value = parsedBalance;
        }
      }

      return setAmountToWithdraw(value);
    },
    [availableParsed],
  );

  const { sendTransactionAsync: sendZapAsync } = useSendTransaction();

  const onButtonClick = useCallback(async () => {
    if (isLoading) {
      return;
    }
    if (!zapsData?.calldata || !cube.earn) {
      toast({
        variant: 'destructive',
        title: 'Transaction data is not ready.',
        description: 'Please wait a moment and try again.',
      });
      return;
    }
    setIsLoading(true);
    try {
      const hash = await sendZapAsync({
        to: cube.earn as Address,
        data: zapsData.calldata,
      });
      if (!hash) {
        return;
      }
      await publicClient.waitForTransactionReceipt({
        hash: hash.hash,
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
  }, [isLoading, sendZapAsync, publicClient, toast, zapsData, cube.earn]);

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
        !amountToWithdraw
      ) {
        return setZapsData(null);
      }
      setIsZapsLoading(true);

      const parsedAmountToWithdraw = parseUnits(
        amountToWithdraw.toString().replace(',', '.'),
        18,
      );

      const size = position
        ? (position[2] * parsedAmountToWithdraw) / positionCost
        : parseUnits(
            amountToWithdraw.toString().replace(',', '.'),
            cube.stableDecimals,
          );

      const data = await withdrawEarn({
        cube,
        provider: publicClient,
        withdrawCost: size,
        tokenTo: selectedVaultToken.address as Address,
        userAddress: address,
        stopLossCostPercent: position ? position[4] : BigInt(0),
        slippage: parseUnits(slippageValue.toString().replace(',', '.'), 18),
        positionCost,
        withdrawUsd: parsedAmountToWithdraw,
        unwrapNative: selectedVaultToken.isNative,
      });
      setZapsData(data);
    }

    loadZapsData()
      .catch((error) => {
        console.error('[EarnWithdraw] Error loading zap data:', error);
        setZapsData(null);
        
        // Show user-friendly error messages
        if (error instanceof Error) {
          const errorMessage = error.message;
          
          if (errorMessage.includes('too small') || errorMessage.includes('invalid')) {
            // Don't show toast for small amounts during calculation, user can adjust
            console.warn('Withdrawal amount validation:', errorMessage);
          } else if (errorMessage.includes('insufficient liquidity')) {
            console.warn('1inch liquidity issue:', errorMessage);
          } else if (errorMessage.includes('1inch') || errorMessage.includes('unavailable')) {
            console.warn('1inch API issue:', errorMessage);
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
    amountToWithdraw,
    position,
    positionCost,
    publicClient,
    slippageValue,
  ]);

  useEffect(() => {
    handleRefresh();
  }, [handleRefresh]);

  return (
    <div className="flex flex-col gap-[16px] rounded-b-[12px] rounded-tr-[12px] bg-white bg-opacity-11 p-[16px]">
      <Collapsible className="flex flex-col gap-4" open={isCollapsibleOpen}>
        <div className="flex flex-col gap-[12px] rounded-[8px] bg-[rgba(53,40,82,0.43)] p-[16px] shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] backdrop-blur-[10px]">
          <div className="flex flex-row justify-between text-[14px] text-[#CFC9FF]">
            <div>
              Available: $
              {formatBigIntComa(
                isMounted && available ? available : BigInt(0),
                18,
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
              value={amountToWithdrawInput}
              onChange={onWithdrawInputChange}
            />
            <DropdownTradeButton
              selectedToken={displaySelectedToken}
              zapsSupported={true}
              open={isCollapsibleOpen}
              setOpen={setIsCollapsibleOpen}
            />
          </div>
        </div>
        <CollapsibleContent asChild>
          <div className="flex flex-col gap-[12px]">
            <WithdrawTokensList
              tokens={vaultTokens}
              loading={isZapsLoading}
              onChange={onCollapsibleValueChange}
              onRefreshClick={handleRefresh}
              defaultToken={selectedToken}
            />
          </div>
        </CollapsibleContent>
      </Collapsible>
      {isMounted && (
        <SlippageModal
          slippageValue={slippageValue}
          onSlippageChange={setSlippageValue}
        />
      )}
      <div className="flex flex-col gap-[16px]">
        <div>
          {isConnected && isMounted ? (
            chain?.id !== chainId ? (
              <Button
                className="w-full"
                variant="contained"
                disabled={isLoading}
                onClick={onSwitchNetworkClick}
              >
                {isLoading && (
                  <Loader2 className="mr-2 h-[20px] w-[20px] animate-spin" />
                )}
                Switch Network
              </Button>
            ) : (
              <Button
                className="w-full"
                variant="contained"
                onClick={onButtonClick}
                disabled={
                  isLoading ||
                  isZapsLoading ||
                  amountToWithdrawInput === 0 ||
                  amountToWithdraw > positionCostParsed
                }
              >
                {amountToWithdrawInput === 0 ? (
                  'Withdraw'
                ) : isLoading || isZapsLoading ? (
                  <Loader2 className="h-8 w-8 animate-spin" />
                ) : (
                  'Withdraw'
                )}
              </Button>
            )
          ) : (
            <ConnectWalletButton />
          )}
        </div>
      </div>
      <InteractionInfo cube={cube} publicClient={publicClient} />
    </div>
  );
};
