'use client';

import { useIsMounted } from '@redduck/helpers-react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { memo } from 'react';
import { useAccount } from 'wagmi';

import { TabsList, TabsTrigger } from '@/components/ui/tabs';
import { vaultsTabsData } from '@/constants/vaults';
import { getFilterQuery, setFilterQuery } from '@/lib/filter-vaults';

type VaultPoolTabsProps = {
  className?: string;
};

export const VaultPoolTabs = memo(({ className }: VaultPoolTabsProps) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const filterQuery = getFilterQuery(searchParams.toString());
  const { address } = useAccount();
  const isMounted = useIsMounted();

  return (
    <div className={className}>
      <TabsList className="h-fit gap-[8px] bg-transparent">
        {vaultsTabsData.map(({ label, value }) => (
          <TabsTrigger
            key={value}
            value={value}
            className="data-[state=active]:bg-primary data-[state=active]:text-white rounded-[8px] px-3 py-2 text-sm text-white hover:bg-primary-hover transition-colors"
            asChild
          >
            <Link
              href={`${pathname}?${setFilterQuery({
                ...filterQuery,
                tag: value || undefined,
                address:
                  address && value === 'my' && isMounted ? address : undefined,
              })}`}
              replace={true}
            >
              {label}
            </Link>
          </TabsTrigger>
        ))}
      </TabsList>
    </div>
  );
});

VaultPoolTabs.displayName = 'VaultPoolTabs';
