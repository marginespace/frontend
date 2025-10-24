import { API_URL } from '@/constants/api';

const APY_URL = API_URL + '/apy/breakdown';

export type Apy = {
  vaultApr?: number | null | string;
  compoundingsPerYear?: number;
  performanceFee?: number;
  vaultApy?: number | null;
  lpFee?: number;
  totalApy?: number | null;
  tradingApr?: number | string;
  liquidStakingApr?: number;
  composablePoolApr?: number;
};
export type ApyResponse = Record<string, Apy>;

export const getAllApys = async (): Promise<ApyResponse> => {
  try {
    const response = await fetch(APY_URL);
    return (await response.json()) as ApyResponse;
  } catch (error) {
    console.error(error);
    return {};
  }
};
