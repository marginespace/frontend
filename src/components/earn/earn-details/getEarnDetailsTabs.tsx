import { AssetDetails } from './asset-details';
import { Distribution } from './distribution';
import { LpBreakdown } from './lp-breakdown';
import { Strategy } from './strategy';

import { type CubeWithApyAndTvl } from '@/actions/get-all-cubes';

type GetVaultDetailReturnType = {
  label: string;
  value: string;
  content: JSX.Element;
};

export const getEarnDetailsTabs = (
  cube: CubeWithApyAndTvl,
  deposit: number,
): GetVaultDetailReturnType[] => {
  return [
    {
      label: 'LP Breakdown',
      value: 'lp-breakdown',
      content: <LpBreakdown cube={cube} />,
    },
    {
      label: 'Strategy',
      value: 'strategy',
      content: <Strategy cube={cube} />,
    },
    {
      label: 'Asset details',
      value: 'asset-details',
      content: <AssetDetails cube={cube} />,
    },
    deposit && {
      label: 'My Distribution',
      value: 'distribution',
      content: <Distribution cube={cube} deposit={deposit} />,
    },
  ].filter((v) => !!v) as GetVaultDetailReturnType[];
};
