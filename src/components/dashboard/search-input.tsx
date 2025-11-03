'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { type HTMLAttributes, useEffect, useMemo, useState } from 'react';
import { useDebounce } from 'use-debounce';
import { isAddress } from 'viem';

import { Input } from '@/components/ui/input';
import { SearchIcon } from '@/components/vault/search/search-icon';
import { getFilterQuery } from '@/lib/filter-vaults';
import { cn } from '@/lib/utils';

export type SearchInput = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
  defaultEmpty?: boolean;
};

export const SearchInput = ({ className, defaultEmpty, ...props }: SearchInput) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const filterQuery = useMemo(
    () => getFilterQuery(searchParams.toString()),
    [searchParams],
  );
  const [searchText, setSearchText] = useState(
    defaultEmpty ? '' : (filterQuery?.address ?? ''),
  );
  const [debouncedSearchText] = useDebounce(searchText, 500);

  useEffect(() => {
    if (
      isAddress(debouncedSearchText) &&
      filterQuery?.address !== debouncedSearchText
    ) {
      router.replace(`/dashboard?address=${debouncedSearchText}`);
    }
  }, [filterQuery, debouncedSearchText, router]);

  useEffect(() => {
    if (defaultEmpty) return;
    if (filterQuery.address && isAddress(filterQuery.address)) {
      setSearchText(filterQuery.address);
    }
  }, [filterQuery, defaultEmpty]);

  return (
    <div
      className={cn('relative w-full self-center lg:max-w-[576px]', className)}
      {...props}
    >
      <Input
        className="w-full rounded-[9px] border-none bg-white/20 py-[10px] pl-[16px] pr-[32px] text-sm font-medium text-light-grey"
        placeholder="Search address..."
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
      />
      <SearchIcon className="absolute right-[16px] top-[12px]" />
    </div>
  );
};
