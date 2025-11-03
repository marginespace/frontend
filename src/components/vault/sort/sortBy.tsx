'use client';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useDebounce } from 'use-debounce';

import { SortItem } from './sort-item';

import { Button } from '@/components/ui/button';
import { CustomDropdown } from '@/components/ui/custom-dropdown';
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
      <CustomDropdown
        open={isOpen}
        onOpenChange={setIsOpen}
        align="end"
        className="w-full min-w-[240px] overflow-hidden rounded-[16px] border border-white/10 bg-white p-0 shadow-[0_8px_32px_rgba(0,0,0,0.12),0_0_1px_rgba(0,0,0,0.05)] md:w-[240px]"
        trigger={
          <Button
            variant="transparent"
            className="w-full flex-row justify-between border-primary md:w-[170px]"
          >
            <h2 className="text-[12px] font-medium text-white">
              Sort By: <span className="text-[14px] font-semibold text-primary">{sortBy}</span>
            </h2>
            <DropdownArrowSVG
              active={!isOpen}
              className={cn(
                'ml-2 h-[18px] w-[18px] fill-primary transition-all duration-300',
                isOpen ? 'rotate-180' : ' ',
              )}
            />
          </Button>
        }
      >
        <div className="p-2">
          {sort.map((sortItem, i) => (
            <SortItem
              title={sortItem.title}
              up={sortItem.up}
              down={sortItem.down}
              handleChange={handleChange}
              key={i}
            />
          ))}
        </div>
      </CustomDropdown>
    </div>
  );
};

