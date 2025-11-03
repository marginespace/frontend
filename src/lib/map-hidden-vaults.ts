import { type VaultWithApyAndTvl } from '@/actions/get-all-vaults-with-apy-and-tvl';

export const mapHiddenVaults = (
  vaults: VaultWithApyAndTvl[],
  ids: string[],
) => {
  return vaults.map((vault) => {
    return {
      ...vault,
      isHidden: ids.includes(vault.id),
    };
  });
};
