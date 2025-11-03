'use client';

import { useIsMounted } from '@redduck/helpers-react';
import { useEffect, useState } from 'react';
import { type Address, formatUnits, parseUnits } from 'viem';
import { useAccount, useContractRead, usePublicClient } from 'wagmi';

import { EarnDeposit } from './deposit';
import { FavoritesButton } from './favorites-button';
import { EarnWithdraw } from './withdraw';

import { earnPoolCheckerAbi } from '@/abi/earn/EarnPoolCheckerAbi';
import { type CubeWithApyAndTvl } from '@/actions/get-all-cubes';
import { type TokensByName } from '@/actions/get-all-tokens';
import { DEFAULT_STABLE, EarnTab } from '@/constants/earn-details';
import { getNetworkTokenAddresses } from '@/constants/networkTokenAddresses';
import { stablecoins } from '@/constants/stablecoins';
import { apiChainToWagmi } from '@/lib/api-chain-to-wagmi';
import { getExpectedSwap } from '@/lib/earn/getExpectedSwap';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/ui/tabs';

export type EarnProps = {
  cube: CubeWithApyAndTvl;
  tokens: TokensByName;
};

export default function EarnInteraction({ cube, tokens }: EarnProps) {
  const [expectedSwap, setExpectedSwap] = useState<string>('0.00');
  const [expectedReservedSwap, setExpectedReservedSwap] =
    useState<string>('0.00');

  const isMounted = useIsMounted();
  const { address } = useAccount();

  const chainVault = apiChainToWagmi(cube?.network || '');
  const chainId = chainVault.id;
  const publicClient = usePublicClient({ chainId });
  const defaultToken = stablecoins.includes(cube.stable)
    ? cube.stable
    : chainVault.nativeCurrency.symbol ?? DEFAULT_STABLE;
  const [selectedDepositToken, setSelectedDepositToken] =
    useState(defaultToken);
  const [selectedWithdrawToken, setSelectedWithdrawToken] =
    useState(defaultToken);

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

  const totalDeposit =
    isMounted && stableReceived ? +formatUnits(stableReceived[0], 18) : 0;
  const depositWithoutReserved =
    isMounted && stableReceived ? +formatUnits(stableReceived[1], 18) : 0;

  const tokenAddresses = getNetworkTokenAddresses(cube.network);

  useEffect(() => {
    (async () => {
      if (!cube) return;

      try {
        const [expectedSwap, expectedReservedSwap] = await Promise.all([
          getExpectedSwap({
            cube,
            provider: publicClient,
            amountIn: parseUnits(
              String(depositWithoutReserved),
              tokenAddresses.stable.decimals,
            ),
            tokenIn: tokenAddresses.stable.address,
            tokenOut: tokenAddresses.wrappedNativeToken.address,
            nativeDecimals: tokenAddresses.wrappedNativeToken.decimals,
          }),
          getExpectedSwap({
            cube,
            provider: publicClient,
            amountIn: parseUnits(
              String(totalDeposit - depositWithoutReserved),
              tokenAddresses.stable.decimals,
            ),
            tokenIn: tokenAddresses.stable.address,
            tokenOut: tokenAddresses.wrappedNativeToken.address,
            nativeDecimals: tokenAddresses.wrappedNativeToken.decimals,
          }),
        ]);

        setExpectedSwap(expectedSwap || '0.00');
        setExpectedReservedSwap(expectedReservedSwap || '0.00');
      } catch (e) {
        console.error(e);
      }
    })();
  }, [
    cube,
    totalDeposit,
    depositWithoutReserved,
    publicClient,
    tokenAddresses.stable,
    tokenAddresses.wrappedNativeToken,
  ]);

  return (
    <div className="col-span-6 rounded-[18px] p-0.5 lg:col-span-2">
      <div className="border-primary flex h-full flex-col gap-[16px] rounded-[16px]   border-2 bg-gradient-to-b from-[rgba(255,255,255,0.28)] via-[rgba(255,255,255,0.17)] p-[16px]">
        <div className="flex flex-row items-center justify-center">
          <div className="flex-[1] text-2xl font-medium">Interaction</div>
          <FavoritesButton cube={cube} />
        </div>
        <Tabs defaultValue={EarnTab.DEPOSIT}>
          <div className="flex flex-col-reverse items-end justify-between gap-4 sm:flex-row sm:items-center">
            <TabsList className="h-auto gap-[8px] self-end rounded-b-none rounded-t-[12px] bg-white bg-opacity-11 pb-0">
              <TabsTrigger
                className="rounded-b-[2px] rounded-t-[8px] py-[8px] text-white data-[state=active]:bg-indigo-350"
                value={EarnTab.DEPOSIT}
              >
                Deposit
              </TabsTrigger>
              <TabsTrigger
                className="rounded-b-[2px] rounded-t-[8px] py-[8px] text-white data-[state=active]:bg-indigo-350"
                value={EarnTab.WITHDRAW}
              >
                Withdraw
              </TabsTrigger>
            </TabsList>
            <div className="flex flex-col items-end gap-1">
              <p className="flex flex-col text-xs font-medium text-white sm:text-[#F1F3F8]">
                Reserved: ${(totalDeposit - depositWithoutReserved).toFixed(2)}{' '}
                (
                {`${expectedReservedSwap} ${tokenAddresses.wrappedNativeToken.symbol}`}
                )
              </p>
              <p className="flex flex-col text-sm font-medium text-white sm:text-[#F1F3F8]">
                Your Deposit: ${depositWithoutReserved.toFixed(2)} (
                {`${expectedSwap} ${tokenAddresses.wrappedNativeToken.symbol}`})
              </p>
            </div>
          </div>

          <TabsContent value={EarnTab.DEPOSIT} className="mt-0">
            <EarnDeposit
              cube={cube}
              tokens={tokens}
              selectedToken={selectedDepositToken}
              setSelectedToken={setSelectedDepositToken}
            />
          </TabsContent>
          <TabsContent value={EarnTab.WITHDRAW} className="mt-0">
            <EarnWithdraw
              cube={cube}
              tokens={tokens}
              selectedToken={selectedWithdrawToken}
              setSelectedToken={setSelectedWithdrawToken}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
