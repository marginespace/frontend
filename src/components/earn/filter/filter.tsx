'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { useDebounce } from 'use-debounce';

import { earnFilters } from './filters';

import { Button } from '@/components/ui/button';
import { Checkbox, CheckboxIndicator } from '@/components/ui/checkbox';
import { CustomDropdown } from '@/components/ui/custom-dropdown';
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
        if (filter.name === name) {
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
    (type: 'chain') => {
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
    if (!filterQuery) return;

    if (filterQuery.chains !== debouncedChains) {
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
  }, [debouncedChains, pathname, router, filterQuery]);

  useEffect(() => {
    const chainFilters = filters.filter(
      (filter) => filter.type === 'chain' && filter.value === true,
    );
    setChains(chainFilters.map((filter) => filter.name).join(','));

    let count = 0;
    for (let i = 0; i < filters.length; i++) {
      if (filters[i].value === true) {
        count++;
      }
    }
    setNumberSelected(count);

    let countChains = 0;
    for (let i = 0; i < filters.length; i++) {
      if (filters[i].type === 'chain') {
        countChains++;
        if (filters[i].value === false) {
          setCheckedAllChains(false);
          break;
        }
        if (countChains === filters.filter((f) => f.type === 'chain').length) {
          setCheckedAllChains(true);
        }
      }
    }
  }, [filters]);

  return (
    <div className={className}>
      <CustomDropdown
        open={isOpen}
        onOpenChange={setIsOpen}
        align="start"
        className="no-scrollbar max-h-[400px] w-full overflow-hidden rounded-[16px] border border-white/10 bg-white p-0 shadow-[0_8px_32px_rgba(0,0,0,0.12),0_0_1px_rgba(0,0,0,0.05)] md:w-[280px]"
        trigger={
          <Button
            variant="transparent"
            className="w-full flex-row justify-between border-primary md:w-[250px]"
          >
            <h2 className="text-[15px] font-semibold text-white">
              Filters{' '}
              {Boolean(numberSelected) && (
                <span className="text-primary">({numberSelected})</span>
              )}
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
        <div className="border-b border-gray-100 px-4 py-3">
          <div className="flex items-center justify-between">
            <h3 className="text-[16px] font-semibold text-[#111827]">Chains</h3>
            <Button
              variant="link"
              onClick={clearAll}
              className="text-[14px] font-medium text-primary hover:text-primary-hover"
            >
              Clear all
            </Button>
          </div>
          <div className="mt-2 flex items-center gap-2">
            <Checkbox
              checked={checkedAllChains}
              onCheckedChange={() => checkAll('chain')}
              className="h-[18px] w-[18px] border-primary data-[state=checked]:bg-primary"
            >
              <CheckboxIndicator />
            </Checkbox>
            <span className="text-[12px] text-gray-500 whitespace-nowrap">Select all</span>
          </div>
        </div>
        <div className="max-h-[300px] overflow-y-auto p-2">
          <div className="space-y-1">
            {filters
              .filter((filter) => filter.type === 'chain')
              .map((filter) => (
                <FilterChain
                  key={filter.name}
                  name={filter.name}
                  title={filter.title}
                  handleChange={handleChange}
                  checked={filter.value}
                  imgUrl={filter.image}
                />
              ))}
          </div>
        </div>
      </CustomDropdown>
    </div>
  );
};

