import { type VaultWithApyAndTvl } from '@/actions/get-all-vaults-with-apy-and-tvl';

export type GroupVaultsByAssetReturnType = {
  groupedByAsset: Record<string, VaultWithApyAndTvl[]>;
  totalAmount: number;
};

export const groupVaultsByAsset = (
  vaults: VaultWithApyAndTvl[],
): GroupVaultsByAssetReturnType => {
  const groupedByAsset: GroupVaultsByAssetReturnType['groupedByAsset'] = {};
  let totalAmount = 0;
  for (const vault of vaults) {
    const { assets } = vault;
    for (const asset of assets) {
      groupedByAsset[asset] = groupedByAsset[asset] || [];
      groupedByAsset[asset].push(vault);
      totalAmount += vault.deposited;
    }
  }
  return { groupedByAsset, totalAmount };
};
