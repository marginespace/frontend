import groupBy from 'lodash.groupby';
import { type Address, formatUnits } from 'viem';

import { vaultV7Abi } from '@/abi/VaultV7';
import { type Vault } from '@/actions/get-all-vaults';
import { apiChainToPublicClient } from '@/lib/api-chain-to-wagmi';

export type VaultsTotalSupplies = Record<string, Record<string, number>>;

export const getVaultsTotalSupplies = async (
  vaults: Vault[],
): Promise<VaultsTotalSupplies> => {
  const groupedByChain = groupBy(vaults, 'chain');

  const settled = await Promise.allSettled(
    Object.entries(groupedByChain).map(async ([chain, vaults]) => {
      const publicClient = apiChainToPublicClient(chain);
      const totalSupplies = await publicClient.multicall({
        contracts: vaults.map((vault) => ({
          abi: vaultV7Abi,
          address: vault.tokenAddress as Address,
          functionName: 'totalSupply',
        })),
        allowFailure: false,
      });
      const decimalses = await publicClient.multicall({
        contracts: vaults.map((vault) => ({
          abi: vaultV7Abi,
          address: vault.tokenAddress as Address,
          functionName: 'decimals',
        })),
        allowFailure: false,
      });
      return [
        chain,
        vaults.reduce(
          (acc, vault, index) => {
            acc[vault.id] = +formatUnits(
              totalSupplies[index],
              decimalses[index],
            );
            return acc;
          },
          {} as Record<string, number>,
        ),
      ] as const;
    }),
  );
  const mapped = settled
    .map((promise) => (promise.status === 'fulfilled' ? promise.value : null))
    .filter((value) => value !== null) as (readonly [
    string,
    Record<string, number>,
  ])[];

  return Object.fromEntries(mapped);
};
