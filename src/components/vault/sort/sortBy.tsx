'use client';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useDebounce } from 'use-debounce';

import { SortItem } from './sort-item';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuPortal,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from '@/components/ui/dropdown-menu';
import { DropdownArrowSVG } from '@/components/ui/icons/dropdown-arrow';
import { getFilterQuery, setFilterQuery } from '@/lib/filter-vaults';
import { cn } from '@/lib/utils';

interface Sort {
  up: boolean;
  down: boolean;
  title: string;
}

type SortByProps = {
  className?: string;
};

export const SortBy = ({ className }: SortByProps) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const filterQuery = getFilterQuery(searchParams.toString());

  const [isOpen, setIsOpen] = useState(false);
  const [sortBy, setSortBy] = useState(filterQuery?.sortBy ?? 'APY');
  const [sortOrder, setSortOrder] = useState<'ASC' | 'DESC'>(
    filterQuery?.sortOrder ?? 'DESC',
  );
  const [debouncedSortBy] = useDebounce(sortBy, 500);
  const [debouncedSortOrder] = useDebounce(sortOrder, 500);
  const [sort, setSort] = useState<Sort[]>([
    {
      up: true,
      down: false,
      title: 'APY',
    },
    {
      up: false,
      down: false,
      title: 'TVL',
    },
    {
      up: false,
      down: false,
      title: 'Popular',
    },
  ]);

  const handleChange = (up: boolean, down: boolean, title: string) => {
    const clearedSort = sort.map((sortItem) => {
      sortItem.down = false;
      sortItem.up = false;
      if (sortItem.title === title) {
        if ((!up && !down) || (!up && down)) {
          setSortOrder('DESC');
          sortItem.up = true;
          sortItem.down = false;
        } else {
          setSortOrder('ASC');
          sortItem.up = false;
          sortItem.down = true;
        }
        setSortBy(title as 'APY' | 'TVL' | 'Popular');
      }
      return sortItem;
    });
    setSort(clearedSort);
  };

  useEffect(() => {
    if (filterQuery.sortBy !== debouncedSortBy) {
      const newFilterQuery = {
        ...filterQuery,
        sortBy: debouncedSortBy || undefined,
      };
      router.replace(`${pathname}?${setFilterQuery(newFilterQuery)}`, {
        scroll: false,
      });
    }
    if (filterQuery.sortOrder !== debouncedSortOrder) {
      const newFilterQuery = {
        ...filterQuery,
        sortOrder: debouncedSortOrder || undefined,
      };
      router.replace(`${pathname}?${setFilterQuery(newFilterQuery)}`, {
        scroll: false,
      });
    }
  }, [pathname, router, filterQuery, debouncedSortBy, debouncedSortOrder]);

  return (
    <div className={className}>
      <DropdownMenu
        modal={false}
        open={isOpen}
        onOpenChange={() => setIsOpen(!isOpen)}
      >
        <DropdownMenuTrigger asChild>
          <Button
            variant={isOpen ? `transparent-active` : 'transparent'}
            className="w-full flex-row justify-between lg:w-[170px]"
          >
            <h2 className="text-[12px] font-medium text-primary">
              Sort By: <span className="text-[14px]">{sortBy}</span>
            </h2>
            <DropdownArrowSVG
              active={!isOpen}
              className={cn(
                'ml-2 h-[18px] w-[18px] transition-all',
                isOpen ? 'rotate-180' : ' ',
              )}
            />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuPortal>
          <DropdownMenuContent className="w-full rounded-[10px] bg-primary p-[16px] md:w-[300px] lg:w-[170px]">
            {sort.map((sortItem, i) => (
              <SortItem
                title={sortItem.title}
                up={sortItem.up}
                down={sortItem.down}
                handleChange={handleChange}
                key={i}
              />
            ))}
          </DropdownMenuContent>
        </DropdownMenuPortal>
      </DropdownMenu>
    </div>
  );
};
