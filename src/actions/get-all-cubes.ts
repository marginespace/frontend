import { type Address } from 'viem';

import { getChainConfig } from './get-chain-config';

import {
  getAllVaultsWithApyAndTvl,
  type VaultWithApyAndTvl,
} from '@/actions/get-all-vaults-with-apy-and-tvl';
import {
  getAllZapConfigs,
  type ZapConfigsResponse,
} from '@/actions/zaps/get-all-zap-configs';
import { API_URL } from '@/constants/api';
import { calculateTotalApy } from '@/lib/earn/calculate-total-apy';
import {
  type CubeDashboardInfoTuple,
  getCubesDashboardInfo,
} from '@/lib/earn/get-cubes-dashboard-info';
import { type FilterQuery } from '@/lib/filter-vaults';

const CUBES_URL = API_URL + '/earn/pools';

export interface CubeVault {
  part: number;
  vaultId: string;
  lpHelper: string;
}

export interface Cube {
  id: string;
  name: string;
  description?: string;
  stableAddress: string;
  stableDecimals: number;
  stable: string;
  earn: string;
  earnHelper: string;
  vaults: CubeVault[];
  earnConfiguration: string;
  priceAggregator: string;
  reservedForAutomation: number;
  status: string;
  risks: [];
  stopLosses: number[];
  gelatoChecker: string;
  createdAt: number;
  network: string;
  uniswapV3Quoter: string;
}

export interface CubeWithApyAndTvl extends Omit<Cube, 'vaults'> {
  avgAPY: number;
  totalTVL: number;
  vaults: (VaultWithApyAndTvl & Omit<CubeVault, 'vaultId'>)[];
  zapConfig?: ZapConfigsResponse[number];
  dashboard: CubeDashboardInfoTuple[1];
  received: string;
}

export const getAllCubes = async (
  filter?: FilterQuery,
): Promise<[CubeWithApyAndTvl[], VaultWithApyAndTvl[]]> => {
  try {
    const [vaults, cubesRaw, zapConfigs, chainConfigs] = await Promise.all([
      getAllVaultsWithApyAndTvl(true, undefined, filter?.address),
      fetch(CUBES_URL, { cache: 'no-cache' }).then(
        (response) => response.json() as Promise<Cube[]>,
      ),
      getAllZapConfigs(),
      getChainConfig(),
    ]);

    // Ensure cubes is an array
    const cubes = Array.isArray(cubesRaw) ? cubesRaw : [];
    
    if (!Array.isArray(cubesRaw)) {
      console.warn('[FRONTEND] getAllCubes: API returned non-array:', typeof cubesRaw, cubesRaw);
    }

    console.log('[FRONTEND] getAllCubes: fetched', cubes.length, 'cubes from API');

    const vaultsMap = vaults.reduce(
      (map, vault) => {
        map[vault.id] = vault;
        return map;
      },
      {} as Record<string, VaultWithApyAndTvl>,
    );

    const cubesDashboard = await getCubesDashboardInfo(
      cubes,
      vaultsMap,
      filter?.address as Address | undefined,
    );

    const fullCubesDetails = cubes.map((cube) => {
      const vaults = cube.vaults.map(({ vaultId, lpHelper, part }) => ({
        ...vaultsMap[vaultId],
        lpHelper,
        part,
      }));
      return {
        ...cube,
        vaults,
        totalTVL: vaults.reduce((prev, cur) => prev + cur.tvl, 0),
        zapConfig: zapConfigs.find((config) => config.chainId === cube.network),
        uniswapV3Quoter: chainConfigs[cube.network].uniswapV3Quoter,
        received:
          cubesDashboard[cube.network]?.[cube.earn as Address]?.balance ?? '0',
        stopLosses: cube.stopLosses,
        dashboard: cubesDashboard[cube.network]?.[cube.earn as Address] ?? {
          now: 0,
          pnl: 0,
          atDeposit: 0,
          stopLoss: 0,
          stopLossPercent: 0,
          vaultsMap: {},
        },
        avgAPY: calculateTotalApy(
          vaults.map(({ apy, part }) => ({ apy, part })),
        ),
      };
    });

    const filteredCubes = fullCubesDetails
      .filter((cube) => {
        // TODO: other filters
        if (!filter) return true;
        const bySearch =
          !filter.search ||
          cube.id.toLowerCase().includes(filter.search.toLowerCase()) ||
          cube.name.toLowerCase().includes(filter.search.toLowerCase()) ||
          cube.stable.toLowerCase().includes(filter.search.toLowerCase());

        const byChain =
          !filter.chains ||
          filter.chains.split(',').includes(cube.network.toLowerCase());

        const byMyVaults = filter?.address
          ? !!cubesDashboard[cube.network]?.[cube.earn as Address]?.balance
          : true;

        return bySearch && byChain && byMyVaults;
      })
      .sort((a, b) => {
        if (filter?.sortBy === 'APY') {
          const aValue = a.avgAPY;
          const bValue = b.avgAPY;

          return filter?.sortOrder === 'ASC'
            ? aValue - bValue
            : bValue - aValue;
        }
        if (filter?.sortBy === 'TVL') {
          const aValue = a.totalTVL;
          const bValue = b.totalTVL;
          return filter?.sortOrder === 'ASC'
            ? aValue - bValue
            : bValue - aValue;
        }
        // TODO: Refactor to Filter popular
        if (filter?.sortBy === 'Popular') {
          const aValue = a.totalTVL;
          const bValue = b.totalTVL;
          return filter?.sortOrder === 'ASC'
            ? aValue - bValue
            : bValue - aValue;
        }
        return 0;
      });

    return [filteredCubes, vaults];
  } catch (error) {
    console.error(error);
    return [[], []];
  }
};
