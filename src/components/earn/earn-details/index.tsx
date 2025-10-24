'use client';

import { useIsMounted } from '@redduck/helpers-react';
import { useMemo } from 'react';
import { formatUnits } from 'viem';
import { type Address, useAccount, useContractRead } from 'wagmi';

import { getEarnDetailsTabs } from './getEarnDetailsTabs';

import { earnPoolCheckerAbi } from '@/abi/earn/EarnPoolCheckerAbi';
import { type CubeWithApyAndTvl } from '@/actions/get-all-cubes';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { apiChainToWagmi } from '@/lib/api-chain-to-wagmi';
import { cn } from '@/lib/utils';

export type VaultDetailsProps = {
  cube: CubeWithApyAndTvl;
};

export const EarnDetails = ({ cube }: VaultDetailsProps) => {
  const { address } = useAccount();
  const isMounted = useIsMounted();

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

  const deposit =
    isMounted && stableReceived ? +formatUnits(stableReceived[0], 18) : 0;

  const earnDetailTabs = useMemo(
    () => getEarnDetailsTabs(cube, deposit),
    [cube, deposit],
  );

  return (
    <Tabs defaultValue={earnDetailTabs[0].value}>
      <TabsList className="z-[1] h-auto justify-normal gap-[8px] rounded-b-[0px] rounded-t-[12px] bg-white bg-opacity-[0.11] pb-0 shadow-tab lg:w-full">
        {earnDetailTabs.map((tab) => (
          <TabsTrigger
            className={cn(
              tab.value === 'boost' && 'bg-[#81E3D8]',
              'rounded-b-[2px] rounded-t-[8px] px-[12px] py-[8px] !text-white data-[state=active]:bg-[#A093FE]',
            )}
            key={tab.value}
            value={tab.value}
          >
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
      {earnDetailTabs.map((tab) => (
        <TabsContent
          className="relative z-[2] rounded-[8px] bg-[#2a2c34]"
          key={tab.value}
          value={tab.value}
        >
          {tab.content}
        </TabsContent>
      ))}
    </Tabs>
  );
};
