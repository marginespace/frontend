'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { type HTMLAttributes, useEffect, useState } from 'react';
import { useDebounce } from 'use-debounce';

import { Input } from '@/components/ui/input';
import { SearchIcon } from '@/components/vault/search/search-icon';
import { getFilterQuery, setFilterQuery } from '@/lib/filter-vaults';
import { cn } from '@/lib/utils';

export type SearchInput = Omit<HTMLAttributes<HTMLDivElement>, 'children'>;

export const SearchInput = ({ className, ...props }: SearchInput) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const filterQuery = getFilterQuery(searchParams.toString());
  const [searchText, setSearchText] = useState(filterQuery?.search ?? '');
  const [debouncedSearchText] = useDebounce(searchText, 500);

  useEffect(() => {
    if ((filterQuery.search || '') !== debouncedSearchText) {
      const newFilterQuery = {
        ...filterQuery,
        search: debouncedSearchText || undefined,
      };

      if (!newFilterQuery.search) {
        delete newFilterQuery.search;
      }

      router.replace(`${pathname}?${setFilterQuery(newFilterQuery)}`, {
        scroll: false,
      });
    }
  }, [pathname, router, filterQuery, debouncedSearchText]);

  return (
    <div
      className={cn('relative w-full self-center lg:max-w-[576px]', className)}
      {...props}
    >
      <Input
        className="w-full rounded-[9px] border-none bg-white/20 py-[10px] pl-[16px] pr-[32px] shadow-[0_4px_10px_rgba(0,0,0,0.2)] backdrop-blur-[10px]"
        placeholder="Search..."
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
      />
      <SearchIcon className="absolute right-[16px] top-[12px]" />
    </div>
  );
};
