'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { useDebounce } from 'use-debounce';

import { earnFilters } from './filters';

import { Button } from '@/components/ui/button';
import { Checkbox, CheckboxIndicator } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuPortal,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { DropdownArrowSVG } from '@/components/ui/icons/dropdown-arrow';
import { FilterChain } from '@/components/vault/filter/filter-chain';
import { getFilterQuery, setFilterQuery } from '@/lib/filter-vaults';
import { cn } from '@/lib/utils';

type FilterProps = {
  className?: string;
};

export const Filter = ({ className }: FilterProps) => {
  const [numberSelected, setNumberSelected] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [checkedAllChains, setCheckedAllChains] = useState(false);
  const [filters, setFilters] = useState(earnFilters);

  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const filterQuery = getFilterQuery(searchParams.toString());

  const [chains, setChains] = useState(filterQuery?.chains ?? '');

  const [debouncedChains] = useDebounce(chains, 500);

  const handleChange = useCallback(
    (name: string, value: boolean) => {
      const updatedFilters = filters.map((filter) => {
        if (filter.name === name.slice(7)) {
          filter.value = value;
        }
        return filter;
      });

      setFilters(updatedFilters);
    },
    [filters],
  );

  const clearAll = useCallback(() => {
    const clearedFilters = filters.map((filter) => {
      filter.value = false;
      return filter;
    });

    setFilters(clearedFilters);
  }, [filters]);

  const checkAll = useCallback(
    (type: 'chain' | 'platform' | 'switch') => {
      const clearedFilters = filters.map((filter) => {
        if (type === 'chain' && filter.type === 'chain') {
          filter.value = !checkedAllChains;
        }
        return filter;
      });

      if (type === 'chain') {
        setCheckedAllChains(!checkedAllChains);
      }
      setFilters(clearedFilters);
    },
    [filters, checkedAllChains],
  );

  useEffect(() => {
    if ((filterQuery.chains || '') !== debouncedChains) {
      const newFilterQuery = {
        ...filterQuery,
        chains: debouncedChains || undefined,
      };

      if (!newFilterQuery.chains) {
        delete newFilterQuery.chains;
      }

      router.replace(`${pathname}?${setFilterQuery(newFilterQuery)}`, {
        scroll: false,
      });
    }
  }, [pathname, router, filterQuery, debouncedChains]);

  useEffect(() => {
    const selectedCount = filters.reduce(
      (count, filterValue) => (filterValue.value ? count + 1 : count),
      0,
    );

    const filteredChains = filters
      .filter((filter) => filter.type === 'chain' && filter.value)
      .map((filter) => filter.name);
    setChains(filteredChains.join(','));

    setNumberSelected(selectedCount);

    setCheckedAllChains(true);

    for (const filter of filters) {
      if (filter.type === 'chain' && !filter.value) {
        setCheckedAllChains(false);
        break;
      }
    }
  }, [filters]);

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
            className="w-full flex-row justify-between lg:w-[250px]"
          >
            <h2 className="text-[16px] font-semibold text-primary ">
              Filters{' '}
              {Boolean(numberSelected) && `(${numberSelected} selected)`}
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
          <DropdownMenuContent className="no-scrollbar max-h-96 overflow-y-auto rounded-[10px] bg-primary p-[16px] shadow-xl  md:w-[250px]">
            <div className="flex justify-center">
              <Button
                variant="link"
                onClick={clearAll}
                className="text-center font-medium text-additional-grey"
              >
                Clear all
              </Button>
            </div>
            <div className="border-b-2 border-dashed border-light-grey ">
              <div className="mb-[4px] flex justify-between py-[8px]">
                <div className="flex items-center">
                  <label
                    htmlFor="filter-chains-all"
                    className="text-[14px] font-medium text-light-purple"
                  >
                    All
                  </label>
                </div>
                <Checkbox
                  onCheckedChange={() => checkAll('chain')}
                  checked={checkedAllChains}
                  id="filter-chains-all"
                  className="flex items-center justify-center"
                >
                  <CheckboxIndicator />
                </Checkbox>
              </div>
              {filters
                .filter((filter) => filter.type === 'chain')
                .map((filter, i) => (
                  <FilterChain
                    key={i}
                    checked={filter.value}
                    name={`filter-${filter.name}`}
                    title={filter.title}
                    handleChange={handleChange}
                    imgUrl={filter.image}
                  />
                ))}
            </div>
          </DropdownMenuContent>
        </DropdownMenuPortal>
      </DropdownMenu>
    </div>
  );
};
