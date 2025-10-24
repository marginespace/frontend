'use client';
import { useQuery } from '@tanstack/react-query';
import dynamic from 'next/dynamic';
import { Suspense, useEffect, useState } from 'react';

import { getAllHiddenVaults } from '@/actions/get-all-hidden-vaults';
import { getAllPromotedVaultsIds } from '@/actions/get-all-promouted-vaults-ids';
import { getAllVaultsWithApyAndTvl } from '@/actions/get-all-vaults-with-apy-and-tvl';
import { type VaultWithApyAndTvl } from '@/actions/get-all-vaults-with-apy-and-tvl';
import { Filter } from '@/components/vault/filter/filter';
import { VaultPoolTabs } from '@/components/vault/pool/pool-tabs';
import { SearchInput } from '@/components/vault/search/search-input';
import { SortBy } from '@/components/vault/sort/sortBy';
import type { FilterQuery } from '@/lib/filter-vaults';
import { mapHiddenVaults } from '@/lib/map-hidden-vaults';
import { Accordion } from '@/ui/accordion';
import { Carousel } from '@/ui/carousel';
import { Tabs } from '@/ui/tabs';

const VaultsRenderer = dynamic(() => import('@/components/vault/pool'), {
  ssr: false,
});

export default function VaultsContainer({
  searchParams,
}: {
  searchParams: FilterQuery;
}) {
  const [vaults, setVaults] = useState<VaultWithApyAndTvl[]>([]);
  const [promotedVaults, setPromotedVaults] = useState<VaultWithApyAndTvl[]>(
    [],
  );

  const { data: dataHiddenVaults } = useQuery({
    queryKey: ['hidden-vaults', searchParams],
    queryFn: () => getAllHiddenVaults(),
  });

  const { data: dataPromotedVaults } = useQuery({
    queryKey: ['promoted-vaults', searchParams],
    queryFn: () => getAllPromotedVaultsIds(),
  });

  const { data: dataVaults } = useQuery({
    queryKey: ['vaults', searchParams],
    queryFn: () => getAllVaultsWithApyAndTvl(true, searchParams),
  });

  useEffect(() => {
    if (!dataVaults || !dataHiddenVaults || !dataPromotedVaults) return;

    const filteredVaults = dataVaults.filter((v) => !v.isArchived);

    setVaults(mapHiddenVaults(filteredVaults, dataHiddenVaults));
    setPromotedVaults(
      mapHiddenVaults(
        dataVaults
          .filter((vault) => dataPromotedVaults.includes(vault.id))
          .toSorted((a, b) =>
            dataPromotedVaults.indexOf(b.id) < dataPromotedVaults.indexOf(a.id)
              ? 1
              : -1,
          ),
        dataHiddenVaults,
      ),
    );
  }, [dataHiddenVaults, dataVaults, dataPromotedVaults]);

  return (
    <>
      <div className="flex flex-col  gap-4 overflow-x-auto rounded-[26px] border border-none border-white bg-white bg-opacity-10 p-4 shadow-md backdrop-blur-lg lg:flex-row">
        <Carousel
          vaults={vaults
            .sort((a, b) => b.tvl ?? 0 - a.tvl ?? 0)
            .filter((vault, i) => i < 12)}
          type="popular"
        />
        <Carousel
          vaults={promotedVaults.length > 0 ? promotedVaults : []}
          type="hot"
        />
        <Carousel
          vaults={vaults
            .sort((a, b) => (b.apy.totalApy ?? 0) - (a.apy.totalApy ?? 0))
            .filter((vault, i) => i < 12)}
          type="profitable"
        />
      </div>
      <Tabs
        defaultValue={searchParams.tag ?? 'all'}
        className="flex flex-col gap-[24px]"
      >
        <div className="flex  flex-wrap items-center justify-between rounded-[15px] border border-white bg-[rgba(255,255,255,0.11)] p-[12px] lg:gap-0">
          <Filter className="w-1/2 pr-1 lg:w-1/3 lg:pr-0" />
          <VaultPoolTabs className="order-3 flex w-full items-center justify-center gap-4 pt-4 lg:order-[0] lg:w-1/3 lg:pl-4 lg:pt-0 xl:pl-0" />
          <SortBy className="w-1/2 justify-end pl-1 lg:flex lg:w-1/3 lg:pl-0" />
        </div>
        <SearchInput />
        <Accordion type="multiple" className="container mx-auto p-0">
          <Suspense
            fallback={
              <div className="mx-auto mt-4 flex text-xl font-semibold">
                Loading...
              </div>
            }
          >
            <VaultsRenderer
              tab={searchParams.tag || 'all'}
              vaults={vaults}
              address={searchParams.address}
            />
          </Suspense>
        </Accordion>
      </Tabs>
    </>
  );
}
