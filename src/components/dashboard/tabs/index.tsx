import { type ReactNode } from 'react';

import { Chain } from './chain';
import { Platform } from './platform';
import { Stablecoin } from './stablecoin';
import { Token } from './token';

import { type CubeWithApyAndTvl } from '@/actions/get-all-cubes';
import { type VaultWithApyAndTvl } from '@/actions/get-all-vaults-with-apy-and-tvl';
import { aggregateCubesAndVaults } from '@/lib/earn/aggregate-cubes-and-vaults';

type OvertierTab = {
  value: string;
  label: string;
  content: ReactNode;
};

export const overviewTabs: (
  vaults: VaultWithApyAndTvl[],
  cubes: CubeWithApyAndTvl[],
) => OvertierTab[] = (vaults, cubes) => {
  const vaultsWithCubes = aggregateCubesAndVaults(cubes, vaults);

  return [
    {
      value: 'chain',
      label: 'Chain',
      content: <Chain vaults={vaults} cubes={cubes} />,
    },
    {
      value: 'platform',
      label: 'Platform',
      content: <Platform vaultsWithCubes={vaultsWithCubes} />,
    },
    {
      value: 'token',
      label: 'Token',
      content: <Token vaultsWithCubes={vaultsWithCubes} />,
    },
    {
      value: 'stablecoin',
      label: 'Stablecoin',
      content: <Stablecoin vaultsWithCubes={vaultsWithCubes} />,
    },
  ];
};
