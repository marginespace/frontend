import { Boost } from './boost';
import { LpBreakdown } from './lp-breakdown';
import { Strategy } from './strategy';

import { type VaultWithApyAndTvl } from '@/actions/get-all-vaults-with-apy-and-tvl';
import { AssetDetails } from '@/components/asset-details';

type GetVaultDetailReturnType = {
  label: string;
  value: string;
  content: JSX.Element;
};

export const getVaultDetailsTabs = (
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
    vault.isMultiToken
      ? {
          label: 'Boost',
          value: 'boost',
          content: <Boost vault={vault} />,
        }
      : undefined,
  ].filter((v) => !!v) as GetVaultDetailReturnType[];
};
