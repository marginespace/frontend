import { cache } from 'react';

import { getAllVaultsWithApyAndTvl } from '@/actions/get-all-vaults-with-apy-and-tvl';

export const getVaultById = cache(async (id: string) => {
  const vaults = await getAllVaultsWithApyAndTvl(true);
  return vaults.find((vault) => vault.id === id);
});
