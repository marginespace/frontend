import { formatUnits } from 'viem';

import { type CubeWithApyAndTvl } from '@/actions/get-all-cubes';
import { type VaultWithApyAndTvl } from '@/actions/get-all-vaults-with-apy-and-tvl';

export const aggregateCubesAndVaults = (
  cubes: CubeWithApyAndTvl[],
  vaults: VaultWithApyAndTvl[],
) => {
  const vaultsMap = vaults.reduce(
    (acc, vault) => {
      acc[vault.id] = vault;
      return acc;
    },
    {} as Record<string, VaultWithApyAndTvl>,
  );

  for (const cube of cubes) {
    for (const vault of cube.vaults) {
      if (!vaultsMap[vault.id]) {
        vaultsMap[vault.id] = { ...vault, deposited: 0 };
      }
      vaultsMap[vault.id].deposited +=
        (+formatUnits(BigInt(cube.received), 18) * vault.part) / 100;
    }
  }

  return Object.values(vaultsMap);
};
