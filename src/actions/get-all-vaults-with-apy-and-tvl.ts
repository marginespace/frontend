import { type Address, formatUnits } from 'viem';

import { getAllZapSupport } from './zaps/get-all-zap-support';

import { type Apy, getAllApys } from '@/actions/get-all-apys';
import { type Boost, getAllBoosts } from '@/actions/get-all-boosts';
import { getAllLps, type Lps } from '@/actions/get-all-lps';
import { getAllPrices } from '@/actions/get-all-prices';
import { getAllTokens, type Token } from '@/actions/get-all-tokens';
import { getAllTvls } from '@/actions/get-all-tvls';
import {
  getAllVaults,
  StrategyTypeId,
  type Vault,
} from '@/actions/get-all-vaults';
import { getArchivedVaults } from '@/actions/get-archived-vaults';
import {
  getAllZapConfigs,
  ZapCategory,
  type ZapConfigsResponse,
} from '@/actions/zaps/get-all-zap-configs';
import { stablecoins } from '@/constants/stablecoins';
import { apiChainToWagmi } from '@/lib/api-chain-to-wagmi';
import { type FilterQuery } from '@/lib/filter-vaults';
import { getVaultsTotalSupplies } from '@/lib/get-vaults-total-supplies';
import { isNativeToken } from '@/lib/is-native-token';
import {
  getVaultsBalancesByAddress,
  type GetVaultsBalancesByAddressReturn,
} from '@/lib/vaults-balances-by-address';
import { getZapAddressForCategory } from '@/lib/zaps/utils';

export type VaultWithApyAndTvl = Vault & {
  apy: Apy;
  tvl: number;
  isMultiToken: boolean;
  deposited: number;
  boost?: Boost;
  zapsSupported: boolean;
  zapConfig?: ZapConfigsResponse[number];
  dashboard: {
    depositedInRaw: string;
    shares: string;
    decimals: number;
    actions: GetVaultsBalancesByAddressReturn[string][number]['actions'];
  };
  zapAddress?: Address;
  lps?: Omit<Lps, 'tokens'> & {
    tokens: Array<((Token & { price?: number }) | string | undefined) | string>;
  };
  isArchived: boolean;
  totalSupply: number;
  isHidden?: boolean;
};

export const getAllVaultsWithApyAndTvl = async (
  all?: boolean,
  filter?: FilterQuery,
  addressFromCube?: string,
): Promise<VaultWithApyAndTvl[]> => {
  try {
    const [
      vaults,
      apys,
      tvls,
      boosts,
      lps,
      prices,
      tokens,
      zapSupports,
      zapConfigs,
      archivedVaults,
    ] = await Promise.all([
      getAllVaults(all),
      getAllApys(),
      getAllTvls(),
      getAllBoosts(),
      getAllLps(),
      getAllPrices(),
      getAllTokens(),
      getAllZapSupport(),
      getAllZapConfigs(),
      getArchivedVaults(),
    ]);

    const [vaultsWhereAddressDeposited, vaultsTotalSupplies] =
      await Promise.all([
        getVaultsBalancesByAddress(vaults, filter?.address ?? addressFromCube),
        getVaultsTotalSupplies(vaults),
      ]);

    const filteredVaults = vaults.filter((vault) => {
      // TODO: other filters
      if (!filter) return true;
      const bySearch =
        !filter.search ||
        vault.name.toLowerCase().includes(filter.search.toLowerCase()) ||
        vault.assets.some(
          (asset) =>
            !filter.search ||
            asset.toLowerCase().includes(filter.search.toLowerCase()),
        );

      const byChain =
        !filter.chains ||
        filter.chains.split(',').includes(vault.chain.toLowerCase());

      const byPlatform =
        !filter.platforms ||
        filter.platforms.split(',').includes(vault.platformId.toLowerCase());

      let byVaultFilter = !filter.vaultsFilters;

      if (!byVaultFilter) {
        const gasTokens = ['ETH', 'BNB', 'MATIC'];

        const byVaultBoost =
          !filter.vaultsFilters?.split(',').includes('boost') ||
          Boolean(boosts[vault.id]);

        const byLp =
          !filter.vaultsFilters?.split(',').includes('lp') ||
          vault.assets.length > 1;

        const bySingle =
          !filter.vaultsFilters?.split(',').includes('single') ||
          vault.assets.length === 1;

        //TODO: By featured
        const byFeatured = !filter.vaultsFilters
          ?.split(',')
          .includes('featured');

        const byVaultStablecoin =
          !filter.vaultsFilters?.split(',').includes('stablecoins') ||
          vault.assets.some((asset) => {
            return stablecoins.some((stablecoin) =>
              asset.toLowerCase().includes(stablecoin.toLowerCase()),
            );
          });

        const byBlueChip =
          !filter.vaultsFilters?.split(',').includes('blueChip') ||
          (vault.assets.some((asset) => {
            return stablecoins.some(
              (stablecoin) => asset.toLowerCase() === stablecoin.toLowerCase(),
            );
          }) &&
            vault.assets.some((asset) => {
              return gasTokens.some(
                (gasToken) => asset.toLowerCase() === gasToken.toLowerCase(),
              );
            }));

        // Review pls
        const byCorrelated =
          !filter.vaultsFilters?.split(',').includes('correlated') ||
          (vault.assets.length > 1 &&
            vault.assets.every((asset) => {
              return asset
                .toLowerCase()
                .includes(vault.assets[vault.assets.length - 1].toLowerCase());
            }));

        const byPaused =
          !filter.vaultsFilters?.split(',').includes('paused') ||
          vault.status === 'paused';

        byVaultFilter =
          byVaultBoost &&
          byVaultStablecoin &&
          bySingle &&
          byLp &&
          byFeatured &&
          byCorrelated &&
          byBlueChip &&
          byPaused;
      }

      const byRetired = vault.status === 'eol';

      const byMyVaults = filter?.address
        ? !!vaultsWhereAddressDeposited[vault.chain]?.[
            vault.earnContractAddress
          ]
        : true;

      return (
        bySearch &&
        !byRetired &&
        byChain &&
        byPlatform &&
        byVaultFilter &&
        byMyVaults
      );
    });

    return filteredVaults
      .map<VaultWithApyAndTvl>((vault) => {
        const vaultLps = lps[vault.id];
        const tokenAddresses = vaultLps?.tokens;
        const zapsSupported = zapSupports[vault.id] ?? false;
        const chain = apiChainToWagmi(vault.chain);
        const isMultiToken =
          vault.strategyTypeId === StrategyTypeId.LP ||
          vault.strategyTypeId === StrategyTypeId.MULTI_LP;

        const zapAddress = getZapAddressForCategory(
          zapConfigs.find((config) => config.chainId === vault.chain) ??
            zapConfigs[0],
          vault.zapCategory ?? ZapCategory.COMMON,
        ) as Address | undefined;

        const vaultTokens =
          vault.chain in tokens
            ? tokenAddresses?.map((tokenAddress) => {
                const token = tokens[vault.chain][tokenAddress];
                return token
                  ? {
                      ...token,
                      price:
                        prices[
                          token.symbol === 'Metis'
                            ? token.symbol.toUpperCase()
                            : token.symbol
                        ],
                    }
                  : isNativeToken(token)
                  ? {
                      type: 'erc20',
                      id: 'native',
                      symbol: chain.nativeCurrency.symbol,
                      name: chain.nativeCurrency.name,
                      chainId: chain.id.toString(),
                      isNative: true,
                      isWNative: false,
                      oracle: '',
                      oracleId: '',
                      address: tokenAddress,
                      decimals: chain.nativeCurrency.decimals,
                      price: prices[chain.nativeCurrency.symbol.toUpperCase()],
                    }
                  : tokenAddress;
              })
            : undefined;
        return {
          ...vault,
          zapsSupported,
          isMultiToken,
          deposited: vaultsWhereAddressDeposited[vault.chain]?.[
            vault.earnContractAddress
          ]
            ? parseFloat(
                formatUnits(
                  BigInt(
                    vaultsWhereAddressDeposited[vault.chain][
                      vault.earnContractAddress
                    ].balance,
                  ),
                  vaultsWhereAddressDeposited[vault.chain][
                    vault.earnContractAddress
                  ].decimals,
                ),
              ) * (vaultLps?.price ?? 0)
            : 0,
          dashboard: {
            depositedInRaw:
              vaultsWhereAddressDeposited[vault.chain]?.[
                vault.earnContractAddress
              ]?.balance ?? '0',
            shares:
              vaultsWhereAddressDeposited[vault.chain]?.[
                vault.earnContractAddress
              ]?.shares ?? '0',
            decimals:
              vaultsWhereAddressDeposited[vault.chain]?.[
                vault.earnContractAddress
              ]?.decimals ?? 18,
            actions:
              vaultsWhereAddressDeposited[vault.chain]?.[
                vault.earnContractAddress
              ]?.actions ?? [],
          },
          apy: (() => {
            const vaultApy = apys[vault.id] ?? {};
            // Always use mock APY for specific vaults regardless of API data
            const mockApyVaults: Record<string, number> = {
              'cakev2-usdt-wbnb': 0.5477, // 54.77%
              'biswap-usdt-wbnb': 0.5744, // 57.44%
            };
            
            // Always use mock data for these vaults
            if (mockApyVaults[vault.id]) {
              return {
                ...vaultApy,
                totalApy: mockApyVaults[vault.id],
                vaultApr: mockApyVaults[vault.id],
                vaultApy: mockApyVaults[vault.id],
                tradingApr: 0,
              };
            }
            
            return vaultApy;
          })(),
          tvl: tvls[vault.id] ? parseFloat(tvls[vault.id].toString()) : 0,
          boost: boosts[vault.id],
          lps: vaultTokens ? { ...vaultLps, tokens: vaultTokens } : vaultLps,
          zapConfig: zapConfigs.find(
            (config) => config.chainId === vault.chain,
          ),
          zapAddress,
          totalSupply: vaultsTotalSupplies[vault.chain]?.[vault.id] ?? 0,
          isArchived: archivedVaults.some((v) => v.id === vault.id),
        };
      })
      .sort((a, b) => {
        if (filter?.sortBy === 'APY') {
          const aValue = a.apy.totalApy ?? 0;
          const bValue = b.apy.totalApy ?? 0;

          return filter?.sortOrder === 'ASC'
            ? aValue - bValue
            : bValue - aValue;
        }
        if (filter?.sortBy === 'TVL') {
          const aValue = a.tvl ?? 0;
          const bValue = b.tvl ?? 0;
          return filter?.sortOrder === 'ASC'
            ? aValue - bValue
            : bValue - aValue;
        }
        // TODO: Refactor to Filter popular
        if (filter?.sortBy === 'Popular') {
          const aValue = a.tvl ?? 0;
          const bValue = b.tvl ?? 0;
          return filter?.sortOrder === 'ASC'
            ? aValue - bValue
            : bValue - aValue;
        }
        return 0;
      });
  } catch (error) {
    console.error(error);
    return [];
  }
};
