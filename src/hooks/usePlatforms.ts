import { useQuery } from '@tanstack/react-query';

import { getAllVaults } from '@/actions/get-all-vaults';
import { type IFilter } from '@/components/vault/filter/filters';
import { capitalize } from '@/helpers/capitalize';

export const getPlatformKey = () => `platforms`;

export const usePlatform = () => {
  return useQuery({
    queryKey: [getPlatformKey()],
    queryFn: async () => {
      const vaults = await getAllVaults(true);

      const uniquePlatformsSet = new Set<string>();

      vaults.forEach((vault) => {
        uniquePlatformsSet.add(vault.platformId);
      });

      const uniquePlatforms = Array.from(uniquePlatformsSet);
      const platformsFilter: IFilter[] = uniquePlatforms.map((platform) => {
        return {
          value: false,
          name: platform,
          type: 'platform',
          title: capitalize(platform),
        };
      });
      return platformsFilter;
    },
  });
};
