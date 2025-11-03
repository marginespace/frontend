import { type ZapCategory } from './zaps/get-all-zap-configs';

import { API_URL } from '@/constants/api';
import { forks, isForks } from '@/constants/supported-chains';

const VAULTS_URL = API_URL + '/vaults';

export enum Oracle {
  LPS = 'lps',
  TOKENS = 'tokens',
}

export enum StrategyTypeId {
  SINGLE = 'single',
  LP = 'lp',
  MAXI = 'maxi',
  MULTI_LP = 'multi-lp',
  SINGLE_LP = 'single-lp',
}

export type Vault = {
  id: string;
  name: string;
  token: string;
  tokenAddress?: string;
  tokenDecimals: number;
  tokenProviderId?: string;
  earnedToken?: string;
  earnedTokenAddress: string;
  earnContractAddress: string;
  oracle: Oracle;
  oracleId: string;
  status: string;
  retireReason?: string;
  platformId: string;
  assets: string[];
  risks?: string[];
  strategyTypeId: StrategyTypeId;
  buyTokenUrl?: string;
  addLiquidityUrl?: string;
  network: string;
  createdAt: number;
  chain: string;
  strategy: string;
  lastHarvest: number;
  pricePerFullShare: string;
  tokenAmmId?: string;
  removeLiquidityUrl?: string;
  depositFee?: string;
  zapCategory?: ZapCategory;
  zapId?: number;
  isGovVault?: boolean;
  migrationIds?: string[];
  showWarning?: boolean;
  warning?: string;
  refund?: boolean;
  refundContractAddress?: string;
};

export const getAllVaults = async (all?: boolean): Promise<Vault[]> => {
  try {
    const response = await fetch(VAULTS_URL);
    const vaults = (await response.json()) as Vault[];
    const tempVaults = isForks
      ? vaults.filter((v) => Object.keys(forks).includes(v.chain))
      : vaults;
    return all ? tempVaults : tempVaults.slice(0, 100);
  } catch (error) {
    console.error(error);
    return [];
  }
};
