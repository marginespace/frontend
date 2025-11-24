import { useIsMounted } from '@redduck/helpers-react';
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
import { Input } from '@/components/vault/trade/ui/input';
import { WithdrawTokensList } from '@/components/vault/trade/withdraw/withdraw-tokens-list';
import { DEFAULT_WITHDRAW_SLIPPAGE } from '@/constants/slippage';
import { useVaultTokensWithdraw } from '@/hooks/useVaultTokensWithdraw';
import { apiChainToWagmi } from '@/lib/api-chain-to-wagmi';
import { getZapsOutData, type ZapsOutDataReturn } from '@/lib/zaps';

export type WithdrawProps = {
  vault: VaultWithApyAndTvl;
  tokens: TokensByName;
  selectedToken: string;
  setSelectedToken: Dispatch<SetStateAction<string>>;
};

export const Withdraw = ({
  vault,
  tokens,
  setSelectedToken,
  selectedToken,
}: WithdrawProps) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isZapsLoading, setIsZapsLoading] = useState(false);
  const isMounted = useIsMounted();
  const { isConnected, address } = useAccount();
  const vaultAddress = vault.earnContractAddress as `0x${string}`;
  const displayDecimals = vault.tokenDecimals;

  const [amountToWithdrawInput, setAmountToWithdraw] = useState(0);
  const [amountToWithdraw] = useDebounce(amountToWithdrawInput, 1000);
  const [isUserEditing, setIsUserEditing] = useState(false);
  const chainVault = apiChainToWagmi(vault.chain);
  const chainId = chainVault.id;
  const publicClient = usePublicClient({ chainId });
  const { chain } = useNetwork();
  const { switchNetworkAsync } = useSwitchNetwork({ chainId });
  const [isCollapsibleOpen, setIsCollapsibleOpen] = useState(false);
  const [zapsData, setZapsData] = useState<ZapsOutDataReturn | null>(null);
  const [slippageValue, setSlippageValue] = useState<number>(
    DEFAULT_WITHDRAW_SLIPPAGE,
  );
  const price = vault.lps?.price ?? 0;

  const displaySelectedToken = selectedToken;
  const vaultTokens = useVaultTokensWithdraw(vault, tokens);
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

  const { data: decimals } = useContractRead({
    abi: erc20ABI,
    address: vaultAddress,
    functionName: 'decimals',
    chainId,
  });

  const { data: available } = useContractRead({
    abi: address ? erc20ABI : undefined,
    address: address ? vaultAddress : undefined,
    functionName: address ? 'balanceOf' : undefined,
    args: address ? [address] : undefined,
    chainId,
    watch: address ? true : undefined,
  });

  const { writeAsync: approveAsync } = useContractWrite({
    abi: erc20ABI,
    address: vaultAddress,
    functionName: 'approve',
    chainId,
  });

  const { writeAsync: withdrawAsync } = useContractWrite({
    abi: vaultV7Abi,
    address: vaultAddress,
    functionName: 'withdraw',
    chainId,
  });

  const { data: allowance } = useContractRead({
    abi: address && zapsData?.zapsData.zapCalldata.to ? erc20ABI : undefined,
    address:
      address && zapsData?.zapsData.zapCalldata.to ? vaultAddress : undefined,
    functionName:
      address && zapsData?.zapsData.zapCalldata.to ? 'allowance' : undefined,
    args:
      address && zapsData?.zapsData.zapCalldata.to
        ? [address, zapsData.zapsData.zapCalldata.to]
        : undefined,
    chainId,
    watch: true,
  });
  const currentAllowance = parseFloat(
    formatUnits(allowance ?? BigInt(0), displayDecimals),
  );
  const amountWithPrice = price ? amountToWithdraw / price : amountToWithdraw;
  const isAllowanceEnough =
    selectedVaultToken?.id === 'lp'
      ? true
      : currentAllowance >= amountWithPrice;

  const onMaxClick = useCallback(() => {
    if (!available) return;
    // Сразу округляем parsedBalance до 6 знаков
    const fullBalance = +formatUnits(available, displayDecimals);
    const parsedBalance = Math.floor(fullBalance * 1000000) / 1000000;
    const maxAmount = price ? parsedBalance * price : parsedBalance;
    // Округлить результат до 6 знаков
    const roundedValue = Math.floor(maxAmount * 1000000) / 1000000;
    setAmountToWithdraw(roundedValue);
    setIsUserEditing(true); // MAX тоже считается редактированием
  }, [available, displayDecimals, price]);

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

      if (available) {
        // Округляем parsedBalance сразу
        const fullBalance = +formatUnits(available, displayDecimals);
        const parsedBalance = Math.floor(fullBalance * 1000000) / 1000000;
        const maxAmount = price ? parsedBalance * price : parsedBalance;
        // Округляем maxAmount до 6 знаков
        const roundedMaxAmount = Math.floor(maxAmount * 1000000) / 1000000;

        if (value > roundedMaxAmount) {
          value = roundedMaxAmount;
        }
      }

      return setAmountToWithdraw(value);
    },
    [available, displayDecimals, price],
  );

  const { sendTransactionAsync: sendZapAsync } = useSendTransaction();

  const approve = useCallback(async () => {
    try {
      // Используем адрес из zapsData, а не из vault.zapAddress
      const zapAddress = zapsData?.zapsData.zapCalldata.to ?? vault.zapAddress;
      
      if (!zapAddress) {
        console.error('No zap address available for approve');
        return;
      }
      
      const amount = Math.ceil(
        price ? amountToWithdrawInput / price : amountToWithdrawInput,
      )
        .toString()
        .replace(',', '.');
      const { hash } = await approveAsync({
        to: vaultAddress,
        args: [zapAddress, parseUnits(amount, vault.tokenDecimals ?? 18)],
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
    amountToWithdrawInput,
    approveAsync,
    price,
    toast,
    vault.tokenDecimals,
    vault.zapAddress,
    vaultAddress,
    zapsData,
  ]);

  const withdraw = useCallback(async () => {
    try {
      const amount = amountWithPrice
        .toFixed(decimals)
        .toString()
        .replace(',', '.');
      const { hash } = await withdrawAsync({
        args: [parseUnits(amount, decimals ?? 18)],
      });
      return hash;
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Error while withdrawing.',
        description: 'Please try again later.',
      });
      return null;
    }
  }, [amountWithPrice, withdrawAsync, decimals, toast]);

  const withdrawZap = useCallback(async () => {
    if (!zapsData?.zapsData.zapCalldata.to || !zapsData?.zapsData.zapCalldata.calldata) {
      throw new Error('Zap data is not ready');
    }
    const { hash } = await sendZapAsync({
      to: zapsData.zapsData.zapCalldata.to as Address,
      data: zapsData.zapsData.zapCalldata.calldata as `0x${string}`,
    });
    return hash;
  }, [sendZapAsync, zapsData]);

  const onButtonClick = useCallback(async () => {
    if (isLoading) {
      return;
    }
    if (isAllowanceEnough && selectedVaultToken?.id !== 'lp' && (!zapsData?.zapsData.zapCalldata.to || !zapsData?.zapsData.zapCalldata.calldata)) {
      toast({
        variant: 'destructive',
        title: 'Transaction data is not ready.',
        description: 'Please wait a moment and try again.',
      });
      return;
    }
    setIsLoading(true);
    try {
      const hash = await (isAllowanceEnough
        ? selectedVaultToken?.id === 'lp'
          ? withdraw()
          : withdrawZap()
        : approve());
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
    withdraw,
    withdrawZap,
    approve,
    publicClient,
    toast,
    zapsData,
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
        !amountToWithdraw
      ) {
        return setZapsData(null);
      }
      setIsZapsLoading(true);
      const data = await getZapsOutData({
        from: address,
        token: selectedVaultToken.address as Address,
        tokenAmount: parseUnits(
          amountWithPrice.toFixed(displayDecimals).toString().replace(',', '.'),
          displayDecimals,
        ),
        slippage: slippageValue,
        vault,
        tokenMetadata: selectedVaultToken,
        zapConfig: vault.zapConfig,
        provider: publicClient,
        signal: abortController.signal,
      });
      setZapsData(data);
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
    amountToWithdraw,
    amountWithPrice,
    displayDecimals,
    publicClient,
    slippageValue,
  ]);

  useEffect(() => {
    handleRefresh();
  }, [handleRefresh]);

  // Auto-fill balance on wallet/token change
  useEffect(() => {
    if (!isConnected || !address || !available) {
      return;
    }

    // Only auto-fill if user hasn't started editing
    if (isUserEditing) {
      return;
    }

    const fullBalance = parseFloat(formatUnits(available, displayDecimals));
    if (fullBalance > 0) {
      // Round to 6 decimals
      const parsedBalance = Math.floor(fullBalance * 1000000) / 1000000;
      const maxAmount = price ? parsedBalance * price : parsedBalance;
      const roundedValue = Math.floor(maxAmount * 1000000) / 1000000;
      setAmountToWithdraw(roundedValue);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConnected, address, available, displayDecimals, price, isUserEditing]);

  return (
    <div className="flex flex-col gap-[16px] rounded-b-[12px] rounded-tr-[12px] bg-white bg-opacity-11 p-[16px]">
      <Collapsible className="flex flex-col gap-4" open={isCollapsibleOpen}>
        <div className="flex flex-col gap-[12px] rounded-[8px] bg-[rgba(53,40,82,0.43)] p-[16px] shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] backdrop-blur-[10px]">
          <div className="flex flex-row justify-between text-[14px] text-[#CFC9FF]">
            <div>
              Available: $
              {(price
                ? price *
                  +formatUnits(
                    isMounted && available ? available : BigInt(0),
                    isMounted && decimals ? displayDecimals : 18,
                  )
                : +formatUnits(
                    isMounted && available ? available : BigInt(0),
                    isMounted && decimals ? displayDecimals : 18,
                  )
              ).toFixed(6)}
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
              zapsSupported={vault.zapsSupported}
              open={isCollapsibleOpen}
              setIsOpen={setIsCollapsibleOpen}
            />
          </div>
        </div>
        {vault.zapsSupported && (
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
        )}
      </Collapsible>
      {isMounted && (
        <SlippageModal
          slippageValue={slippageValue}
          onSlippageChange={setSlippageValue}
        />
      )}
      <div className="flex flex-col gap-[16px]">
        {/*<div>*/}
        {/*  {vault.removeLiquidityUrl && (*/}
        {/*    <Link*/}
        {/*      href={vault.removeLiquidityUrl}*/}
        {/*      target="_blank"*/}
        {/*      className={cn('w-auto', buttonVariants({ variant: 'outlined' }))}*/}
        {/*    >*/}
        {/*      Remove Liquidity <LinkIcon className="ml-2 h-[20px] w-[20px]" />*/}
        {/*    </Link>*/}
        {/*  )}*/}
        {/*</div>*/}
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
                  isLoading || isZapsLoading || amountToWithdrawInput === 0
                }
              >
                {amountToWithdrawInput === 0 ? (
                  'Withdraw'
                ) : isLoading || isZapsLoading ? (
                  <Loader2 className="h-8 w-8 animate-spin" />
                ) : zapsData && !isAllowanceEnough ? (
                  'Approve'
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
      <TradeInfo vault={vault} publicClient={publicClient} />
    </div>
  );
};
