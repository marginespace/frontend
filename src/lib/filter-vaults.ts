import { parse, stringify } from 'querystring';

import { type VaultsTabValue } from '@/constants/vaults';

// TODO: other filters
export type FilterQuery = {
  search?: string;
  sortBy?: 'APY' | 'TVL' | 'Popular';
  sortOrder?: 'ASC' | 'DESC';
  chains?: string;
  platforms?: string;
  vaultsFilters?: string;
  tag?: VaultsTabValue;
  address?: string;
};

export const getFilterQuery = (locationSearch: string): FilterQuery =>
  parse(locationSearch);

export const setFilterQuery = (filterQuery: FilterQuery): string =>
  stringify(
    Object.entries(filterQuery).reduce(
      (acc, [key, value]) => {
        if (value) {
          acc[key] = value;
        }
        return acc;
      },
      {} as Record<string, string>,
    ),
  );
