'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { useDebounce } from 'use-debounce';

import { FilterChain } from './filter-chain';
import { FilterItem } from './filter-item';
import { FilterPlatform } from './filter-platform';
import { poolFilters } from './filters';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Checkbox, CheckboxIndicator } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuPortal,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { DropdownArrowSVG } from '@/components/ui/icons/dropdown-arrow';
import { Input } from '@/components/ui/input';
import { SearchIcon } from '@/components/vault/search/search-icon';
import { usePlatform } from '@/hooks/usePlatforms';
import { getFilterQuery, setFilterQuery } from '@/lib/filter-vaults';
import { cn } from '@/lib/utils';

type FilterProps = {
  className?: string;
};

export const Filter = ({ className }: FilterProps) => {
  const [numberSelected, setNumberSelected] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [checkedAllChains, setCheckedAllChains] = useState(false);
  const [checkedAllPlatforms, setCheckedAllPlatforms] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [filters, setFilters] = useState(poolFilters);

  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const filterQuery = getFilterQuery(searchParams.toString());

  const [chains, setChains] = useState(filterQuery?.chains ?? '');

  const [debouncedChains] = useDebounce(chains, 500);

  const [platforms, setPlatforms] = useState(filterQuery?.platforms ?? '');
  const [debouncedPlatforms] = useDebounce(platforms, 500);

  const [vaultsFilters, setVaultsFilters] = useState(
    filterQuery?.vaultsFilters ?? '',
  );
  const [debouncedVaultsFilters] = useDebounce(vaultsFilters, 500);

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
        if (type === 'platform' && filter.type === 'platform') {
          filter.value = !checkedAllPlatforms;
        }
        return filter;
      });

      if (type === 'chain') {
        setCheckedAllChains(!checkedAllChains);
      }
      if (type === 'platform') {
        setCheckedAllPlatforms(!checkedAllPlatforms);
      }
      setFilters(clearedFilters);
    },
    [filters, checkedAllChains, checkedAllPlatforms],
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

    if ((filterQuery.platforms || '') !== debouncedPlatforms) {
      const newFilterQuery = {
        ...filterQuery,
        platforms: debouncedPlatforms || undefined,
      };

      if (!newFilterQuery.platforms) {
        delete newFilterQuery.platforms;
      }

      router.replace(`${pathname}?${setFilterQuery(newFilterQuery)}`, {
        scroll: false,
      });
    }

    if ((filterQuery.vaultsFilters || '') !== debouncedVaultsFilters) {
      const newFilterQuery = {
        ...filterQuery,
        vaultsFilters: debouncedVaultsFilters || undefined,
      };

      if (!newFilterQuery.vaultsFilters) {
        delete newFilterQuery.vaultsFilters;
      }

      router.replace(`${pathname}?${setFilterQuery(newFilterQuery)}`, {
        scroll: false,
      });
    }
  }, [
    pathname,
    router,
    filterQuery,
    debouncedChains,
    debouncedPlatforms,
    debouncedVaultsFilters,
  ]);

  const { data, isLoading } = usePlatform();

  useEffect(() => {
    if (data && !isLoading) {
      setFilters([...filters, ...data]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading]);

  useEffect(() => {
    const selectedCount = filters.reduce(
      (count, filterValue) => (filterValue.value ? count + 1 : count),
      0,
    );

    const filteredChains = filters
      .filter((filter) => filter.type === 'chain' && filter.value)
      .map((filter) => filter.name);
    setChains(filteredChains.join(','));

    const filteredPlatforms = filters
      .filter((filter) => filter.type === 'platform' && filter.value)
      .map((filter) => filter.name);
    setPlatforms(filteredPlatforms.join(','));

    const filteredVaultFilters = filters
      .filter((filter) => filter.type === 'switch' && filter.value)
      .map((filter) => filter.name);
    setVaultsFilters(filteredVaultFilters.join(','));

    setNumberSelected(selectedCount);

    setCheckedAllChains(true);

    for (const filter of filters) {
      if (filter.type === 'chain' && !filter.value) {
        setCheckedAllChains(false);
        break;
      }
    }

    setCheckedAllPlatforms(true);
    for (const filter of filters) {
      if (filter.type === 'platform' && !filter.value) {
        setCheckedAllPlatforms(false);
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
            <h2 className="text-[16px] font-semibold text-primary">
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
            {/* <ChevronDown
              className={cn(
                'ml-2 h-[18px] w-[18px] transition-all',
                !isOpen ? 'rotate-180 text-primary' : ' text-light-purple',
              )}
            /> */}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuPortal>
          <DropdownMenuContent className="no-scrollbar max-h-96 w-full overflow-y-auto rounded-[10px] bg-primary p-[16px] shadow-xl md:w-[300px] lg:w-[250px]">
            <div className="flex justify-center">
              <Button
                variant="link"
                onClick={clearAll}
                className="text-center font-medium text-additional-grey"
              >
                Clear all
              </Button>
            </div>
            <div>
              <div className="border-b-2 border-dashed border-primary ">
                <div className="text-[16px] font-semibold text-text">
                  Filters
                </div>
                {filters
                  .filter((filter) => filter.type === 'switch')
                  .map((filter) => (
                    <FilterItem
                      key={filter.name}
                      checked={filter.value}
                      name={`filter-${filter.name}`}
                      title={filter.title}
                      tooltip={filter.tooltip ? filter.tooltip : ''}
                      handleChange={handleChange}
                    />
                  ))}
              </div>
            </div>
            <Accordion type="multiple">
              <AccordionItem value="item-1" className="border-0">
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex justify-between">
                    <div className="text-[16px] font-semibold text-text">
                      Chain
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
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
                      .map((filter) => (
                        <FilterChain
                          key={filter.name}
                          checked={filter.value}
                          name={`filter-${filter.name}`}
                          title={filter.title}
                          handleChange={handleChange}
                          imgUrl={filter.image}
                        />
                      ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2" className="border-0">
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex justify-between">
                    <div className="text-[16px] font-semibold text-text">
                      Platform
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="border-b-2 border-dashed border-light-grey pt-[16px]">
                    <div className="relative mb-[16px] px-[4px]">
                      <Input
                        className="border-0 bg-[#F1F0F8] text-additional-grey focus-visible:ring-0 focus-visible:ring-offset-additional-grey"
                        placeholder="Search..."
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                      />
                      <SearchIcon className="absolute right-[16px] top-[12px]" />
                    </div>
                    <div className="mb-[4px] flex justify-between py-[8px]">
                      <div className="flex items-center">
                        <label
                          htmlFor="filter-platforms-all"
                          className="text-[14px] font-medium text-light-purple"
                        >
                          All
                        </label>
                      </div>
                      <Checkbox
                        onCheckedChange={() => checkAll('platform')}
                        checked={checkedAllPlatforms}
                        id="filter-platforms-all"
                        className="flex items-center justify-center"
                      >
                        <CheckboxIndicator />
                      </Checkbox>
                    </div>

                    {filters
                      .filter(
                        (filter) =>
                          filter.type === 'platform' &&
                          filter.name
                            .toLowerCase()
                            .includes(searchValue.toLowerCase()),
                      )
                      .map((filter) => (
                        <FilterPlatform
                          key={filter.name}
                          checked={filter.value}
                          name={`filter-${filter.name}`}
                          title={filter.title}
                          handleChange={handleChange}
                        />
                      ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </DropdownMenuContent>
        </DropdownMenuPortal>
      </DropdownMenu>
    </div>
  );
};
