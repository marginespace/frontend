import { Strategy } from './strategy';

import { LpBreakdown } from '../vault-details/lp-breakdown';

import { type VaultWithApyAndTvl } from '@/actions/get-all-vaults-with-apy-and-tvl';
import { AssetDetails } from '@/components/asset-details';

type GetVaultDetailReturnType = {
  label: string;
  value: string;
  content: JSX.Element;
};

export const getVaultEditDetailsTabs = (
  vault: VaultWithApyAndTvl,
): GetVaultDetailReturnType[] => {
  return [
    vault.isMultiToken
      ? {
          label: 'LP Breakdown',
          value: 'lp-breakdown',
          content: <LpBreakdown vault={vault} />,
        }
      : undefined,
    {
      label: 'Strategy',
      value: 'strategy',
      content: <Strategy vault={vault} />,
    },
    {
      label: 'Asset details',
      value: 'asset-details',
      content: <AssetDetails vault={vault} />,
    },
  ].filter((v) => !!v) as GetVaultDetailReturnType[];
};
