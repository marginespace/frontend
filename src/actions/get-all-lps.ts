import { API_URL } from '@/constants/api';

const LPS_URL = API_URL + '/lps/breakdown';

export type Lps = {
  price: number;
  tokens: string[];
  balances: string[];
  totalSupply: string;
};
export type LpsByPool = Record<string, Lps>;

export const getAllLps = async (): Promise<LpsByPool> => {
  try {
    const response = await fetch(LPS_URL);
    return (await response.json()) as LpsByPool;
  } catch (error) {
    console.error(error);
    return {};
  }
};
