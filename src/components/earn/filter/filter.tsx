'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { useDebounce } from 'use-debounce';

import { earnFilters } from './filters';

import { Button } from '@/components/ui/button';
import { Checkbox, CheckboxIndicator } from '@/components/ui/checkbox';
import { CustomDropdown } from '@/components/ui/custom-dropdown';
import { DropdownArrowSVG } from '@/components/ui/icons/dropdown-arrow';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { FilterChain } from '@/components/vault/filter/filter-chain';
import { FilterPlatform } from '@/components/vault/filter/filter-platform';
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
  const [filters, setFilters] = useState(earnFilters);

  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const filterQuery = getFilterQuery(searchParams.toString());

  const [chains, setChains] = useState(filterQuery?.chains ?? '');
  const [platforms, setPlatforms] = useState(filterQuery?.platforms ?? '');

  const [debouncedChains] = useDebounce(chains, 500);
  const [debouncedPlatforms] = useDebounce(platforms, 500);

  const { data: allPlatforms } = usePlatform();

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
    (type: 'chain' | 'platform') => {
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

  // Инициализация фильтров из URL параметров при монтировании
  useEffect(() => {
    if (filterQuery && filters.length > 0) {
      const updatedFilters = filters.map((filter) => {
        if (filter.type === 'chain' && filterQuery.chains) {
          const selectedChains = filterQuery.chains.split(',');
          return { ...filter, value: selectedChains.includes(filter.name) };
        }
        if (filter.type === 'platform' && filterQuery.platforms) {
          const selectedPlatforms = filterQuery.platforms.split(',');
          return { ...filter, value: selectedPlatforms.includes(filter.name) };
        }
        return filter;
      });
      setFilters(updatedFilters);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterQuery?.chains, filterQuery?.platforms]); // Только при изменении URL параметров

  useEffect(() => {
    if (allPlatforms && allPlatforms.length > 0) {
      // Добавляем платформы в filters, если их еще нет
      setFilters((prev) => {
        const existingPlatformNames = prev
          .filter((f) => f.type === 'platform')
          .map((f) => f.name);
        const newPlatforms = allPlatforms.filter(
          (p) => !existingPlatformNames.includes(p.name),
        );
        if (newPlatforms.length > 0) {
          // Инициализируем значения платформ из URL
          const platformsFromUrl = filterQuery?.platforms?.split(',') || [];
          const initializedPlatforms = newPlatforms.map((p) => ({
            ...p,
            value: platformsFromUrl.includes(p.name),
          }));
          return [...prev, ...initializedPlatforms];
        }
        return prev;
      });
    }
  }, [allPlatforms, filterQuery?.platforms]);

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

    if (filterQuery.platforms !== debouncedPlatforms) {
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
  }, [debouncedChains, debouncedPlatforms, pathname, router, filterQuery]);

  useEffect(() => {
    const chainFilters = filters.filter(
      (filter) => filter.type === 'chain' && filter.value === true,
    );
    setChains(chainFilters.map((filter) => filter.name).join(','));

    const platformFilters = filters.filter(
      (filter) => filter.type === 'platform' && filter.value === true,
    );
    setPlatforms(platformFilters.map((filter) => filter.name).join(','));

    let count = 0;
    for (let i = 0; i < filters.length; i++) {
      if (filters[i].value === true) {
        count++;
      }
    }
    setNumberSelected(count);

    let countChains = 0;
    let countPlatforms = 0;
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
      if (filters[i].type === 'platform') {
        countPlatforms++;
        if (filters[i].value === false) {
          setCheckedAllPlatforms(false);
          break;
        }
        if (
          countPlatforms === filters.filter((f) => f.type === 'platform').length
        ) {
          setCheckedAllPlatforms(true);
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
            <h3 className="text-[16px] font-semibold text-[#111827]">Filters</h3>
            <Button
              variant="link"
              onClick={clearAll}
              className="text-[14px] font-medium text-primary hover:text-primary-hover"
            >
              Clear all
            </Button>
          </div>
        </div>
        <div className="max-h-[400px] overflow-y-auto p-2">
          <Accordion type="multiple" className="w-full">
            <AccordionItem value="item-1" className="border-b-0">
              <AccordionTrigger className="rounded-lg px-3 py-2 hover:bg-primary/10 data-[state=open]:bg-primary/10">
                <div className="flex items-center justify-between w-full pr-2">
                  <span className="text-[14px] font-semibold text-[#111827]">
                    Chains
                  </span>
                  <div className="flex items-center gap-2 flex-shrink-0">
            <Checkbox
              checked={checkedAllChains}
              onCheckedChange={() => checkAll('chain')}
                      onClick={(e) => e.stopPropagation()}
              className="h-[18px] w-[18px] border-primary data-[state=checked]:bg-primary"
            >
              <CheckboxIndicator />
            </Checkbox>
                    <span className="text-[12px] text-gray-500 whitespace-nowrap">All</span>
          </div>
        </div>
              </AccordionTrigger>
              <AccordionContent className="px-3 pb-2">
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
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2" className="border-b-0">
              <AccordionTrigger className="rounded-lg px-3 py-2 hover:bg-primary/10 data-[state=open]:bg-primary/10">
                <div className="flex items-center justify-between w-full pr-2">
                  <span className="text-[14px] font-semibold text-[#111827]">
                    Platforms
                  </span>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Checkbox
                      checked={checkedAllPlatforms}
                      onCheckedChange={() => checkAll('platform')}
                      onClick={(e) => e.stopPropagation()}
                      className="h-[18px] w-[18px] border-primary data-[state=checked]:bg-primary"
                    >
                      <CheckboxIndicator />
                    </Checkbox>
                    <span className="text-[12px] text-gray-500 whitespace-nowrap">All</span>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-3 pb-2">
                <div className="space-y-1">
                  {filters
                    .filter((filter) => filter.type === 'platform')
                    .map((filter) => (
                      <FilterPlatform
                        key={filter.name}
                        name={filter.name}
                        title={filter.title}
                        handleChange={handleChange}
                        checked={filter.value}
                        imgUrl={allPlatforms?.find((p) => p.name === filter.name)?.image || filter.image}
                      />
                    ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </CustomDropdown>
    </div>
  );
};

