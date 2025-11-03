import { API_URL } from '@/constants/api';

const BOOST_URL = API_URL + '/boosts';

export enum EarnedOracle {
  Lps = 'lps',
  Tokens = 'tokens',
}

export enum Status {
  Active = 'active',
  Closed = 'closed',
}

export type Boost = {
  id: string;
  poolId: string;
  name: string;
  assets?: string[];
  tokenAddress?: string;
  earnedToken: string;
  earnedTokenDecimals: number;
  earnedTokenAddress: string;
  earnContractAddress: string;
  earnedOracle: EarnedOracle;
  earnedOracleId: string;
  partnership: boolean;
  status: Status;
  isMooStaked: boolean;
  partners: string[];
  chain: string;
  periodFinish: number;
  logo?: string;
  fixedStatus?: boolean;
};
export type BoostResponse = Record<string, Boost>;

export const getAllBoosts = async (): Promise<BoostResponse> => {
  try {
    const response = await fetch(BOOST_URL);
    const boosts = (await response.json()) as Boost[];
    return boosts.reduce(
      (acc, boost) => ({ ...acc, [boost.poolId]: boost }),
      {} as BoostResponse,
    );
  } catch (error) {
    console.error(error);
    return {};
  }
};
