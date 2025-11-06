'use client';
import { useQuery } from '@tanstack/react-query';
import dynamic from 'next/dynamic';
import { Suspense, useEffect } from 'react';

import { getAllCubes } from '@/actions/get-all-cubes';
import { getAllVaultsWithApyAndTvl } from '@/actions/get-all-vaults-with-apy-and-tvl';
import { type ChainConfig } from '@/actions/get-chain-config';
import { NewCube } from '@/components/earn/dialogs/new-cube/new-cube';
import { EarnTitleInfo } from '@/components/earn/earn-title-info';
import { Filter } from '@/components/earn/filter/filter';
import { CubePoolTabs } from '@/components/earn/pool/pool-tabs';
import { Accordion } from '@/components/ui/accordion';
import { Tabs } from '@/components/ui/tabs';
import { SearchInput } from '@/components/vault/search/search-input';
import { SortBy } from '@/components/vault/sort/sortBy';
import { type FilterQuery } from '@/lib/filter-vaults';
import { Button } from '@/ui/button';

const CubesRenderer = dynamic(() => import('@/components/earn/pool'), {
  ssr: false,
});

export default function EarnWrapper({
  searchParams,
  configs,
}: {
  searchParams: FilterQuery;
  configs: Record<string, ChainConfig>;
}) {
  const { data: dataCubes, isLoading: isCubesLoading } = useQuery({
    queryKey: ['cubes', searchParams],
    queryFn: () => getAllCubes(searchParams),
  });


  const { data: vaults, isLoading: isVaultsLoading } = useQuery({
    queryKey: ['vaults', searchParams],
    queryFn: () => getAllVaultsWithApyAndTvl(true, searchParams),
  });

  return (
    <>
      <div className="flex items-end justify-between">
        <div className="flex flex-col gap-[16px] md:flex-row">
          <EarnTitleInfo />
        </div>
        <NewCube
          configs={configs}
          vaults={!vaults || isVaultsLoading ? [] : vaults}
        >
          <Button variant="transparent" className="ml-[10px]">
            Create new strategy
          </Button>
        </NewCube>
      </div>

      <Tabs
        defaultValue={searchParams.tag ?? 'all'}
        className="flex flex-col gap-[24px]"
      >
        <div className="flex flex-wrap items-center justify-between rounded-[15px] border border-white bg-[rgba(255,255,255,0.11)] p-[12px] md:gap-0">
          <Filter className="w-1/2 pr-1 md:w-1/3 md:pr-0" />
          <CubePoolTabs className="order-3 flex w-full items-center justify-center gap-4 pt-4 md:order-[0] md:w-1/3 md:pl-4 md:pt-0 xl:pl-0" />
          <SortBy className="w-1/2 justify-end pl-1 md:flex md:w-1/3 md:pl-0" />
        </div>
        <SearchInput />
        <div className="flex justify-center">
          <Accordion
            type="multiple"
            className="mx-auto w-full max-w-[95%] px-4 sm:max-w-[98%] sm:px-6 md:max-w-[1920px] md:px-8 lg:px-12 xl:max-w-[1535px] 2xl:max-w-[1535px]"
          >
            <Suspense
              fallback={
                <div className="mx-auto mt-4 flex text-xl font-semibold">
                  Loading...
                </div>
              }
            >
              <CubesRenderer
                tab={searchParams.tag || 'all'}
                cubes={!dataCubes || isCubesLoading ? [] : dataCubes[0]}
                address={searchParams.address}
              />
            </Suspense>
          </Accordion>
        </div>
      </Tabs>
    </>
  );
}
