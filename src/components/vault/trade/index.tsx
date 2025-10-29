'use client';

import { useIsMounted } from '@redduck/helpers-react';
import { formatBigIntComa } from '@redduck/helpers-viem';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { formatUnits, parseUnits } from 'viem';
import { useAccount, useContractRead, usePublicClient } from 'wagmi';

import { vaultV7Abi } from '@/abi/VaultV7';
import { type TokensByName } from '@/actions/get-all-tokens';
import { type VaultWithApyAndTvl } from '@/actions/get-all-vaults-with-apy-and-tvl';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FavoritesButton } from '@/components/vault/favorites-button';
import { Deposit } from '@/components/vault/trade/deposit';
import { Withdraw } from '@/components/vault/trade/withdraw';
import { getNetworkTokenAddresses } from '@/constants/networkTokenAddresses';
import { stablecoins } from '@/constants/stablecoins';
import { apiChainToWagmi } from '@/lib/api-chain-to-wagmi';
import { getExpectedVaultSwap } from '@/lib/getExpectedVaultSwap';

export type TradeProps = {
  vault: VaultWithApyAndTvl;
  tokens: TokensByName;
  hiddenIds: string[];
  admins: string[];
};

enum TradeTabs {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}

export const Trade = ({ vault, tokens, hiddenIds, admins }: TradeProps) => {
  const [expectedSwap, setExpectedSwap] = useState<string>('0.00');
  const isMounted = useIsMounted();
  const router = useRouter();
  const { address } = useAccount();
  const chainVault = apiChainToWagmi(vault.network || '');
  const chainId = chainVault.id;
  const publicClient = usePublicClient({ chainId });
  const defaultToken =
    vault.assets.find((asset) => stablecoins.includes(asset)) ??
    chainVault.nativeCurrency.symbol ??
    'USDC';
  const [selectedDepositToken, setSelectedDepositToken] =
    useState(defaultToken);
  const [selectedWithdrawToken, setSelectedWithdrawToken] =
    useState(defaultToken);
  const isAdmin = admins.includes(address ?? '');
  const vaultAddress = vault.earnContractAddress as `0x${string}`;

  const tokenAddresses = getNetworkTokenAddresses(vault.network);

  const { data: deposited } = useContractRead({
    abi: vaultV7Abi,
    address: vaultAddress,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    chainId: apiChainToWagmi(vault.chain).id,
    watch: true,
  });

  if (deposited !== undefined && deposited === BigInt(0) && vault.isArchived) {
    router.push('/');
  }

  const price = vault.lps?.price ?? 0;

  const showDeposited = price
    ? `$${(
        price *
        +formatUnits(
          isMounted && deposited ? deposited : BigInt(0),
          vault.tokenDecimals,
        )
      ).toFixed(2)}`
    : `${formatBigIntComa(
        isMounted && deposited ? deposited : BigInt(0),
        18,
        2,
      )} LP`;

  useEffect(() => {
    (async () => {
      try {
        const formatedDeposited =
          price *
          +formatUnits(
            isMounted && deposited ? deposited : BigInt(0),
            vault.tokenDecimals,
          );

        const nativeTokenAmount = await getExpectedVaultSwap({
          chain: vault.network,
          provider: publicClient,
          amountIn: parseUnits(
            String(formatedDeposited),
            tokenAddresses.stable.decimals,
          ),
          tokenIn: tokenAddresses.stable.address,
          tokenOut: tokenAddresses.wrappedNativeToken.address,
          nativeDecimals: tokenAddresses.wrappedNativeToken.decimals,
        });

        setExpectedSwap(nativeTokenAmount || '');
      } catch (e) {
        console.error(e);
      }
    })();
  }, [
    vault,
    deposited,
    publicClient,
    tokenAddresses.stable,
    tokenAddresses.wrappedNativeToken,
    price,
    isMounted,
  ]);

  if (!isAdmin && hiddenIds.includes(vault.id)) router.push('/');

  return (
    <div className="col-span-6 rounded-[18px] p-0.5 lg:col-span-2">
      <div className="border-primary flex h-full flex-col gap-2 rounded-[16px] border-2   bg-gradient-to-b from-[rgba(255,255,255,0.28)] via-[rgba(255,255,255,0.17)] p-[16px] sm:gap-4">
        <div className="flex flex-row items-center justify-center">
          <div className="flex-[1] text-2xl font-medium">Trade</div>
          <FavoritesButton vault={vault} />
        </div>
        <Tabs defaultValue={TradeTabs.DEPOSIT}>
          <div className="flex flex-col-reverse items-start justify-between gap-4 sm:flex-row sm:items-center">
            <TabsList className="h-auto gap-[8px] rounded-b-none rounded-t-[12px] bg-white bg-opacity-11 pb-0">
              {vault.isArchived ? (
                <></>
              ) : (
                <TabsTrigger
                  className="rounded-b-[2px] rounded-t-[8px] py-[8px] text-white data-[state=active]:bg-indigo-350"
                  value={TradeTabs.DEPOSIT}
                >
                  Deposit
                </TabsTrigger>
              )}
              <TabsTrigger
                className="rounded-b-[2px] rounded-t-[8px] py-[8px] text-white data-[state=active]:bg-indigo-350"
                value={TradeTabs.WITHDRAW}
              >
                Withdraw
              </TabsTrigger>
            </TabsList>

            <p className="flex flex-col px-2 text-sm font-medium text-white sm:text-[#F1F3F8]">
              Your Deposit: {showDeposited} (
              {`${expectedSwap} ${tokenAddresses.wrappedNativeToken.symbol}`})
            </p>
          </div>

          <TabsContent value={TradeTabs.DEPOSIT} className="mt-0">
            <Deposit
              vault={vault}
              tokens={tokens}
              selectedToken={selectedDepositToken}
              setSelectedToken={setSelectedDepositToken}
            />
          </TabsContent>
          <TabsContent value={TradeTabs.WITHDRAW} className="mt-0">
            <Withdraw
              vault={vault}
              tokens={tokens}
              selectedToken={selectedWithdrawToken}
              setSelectedToken={setSelectedWithdrawToken}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
