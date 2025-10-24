import { API_URL } from '@/constants/api';

const PRICES_URL = API_URL + '/prices';

export type PriceResponse = Record<string, number>;

export const getAllPrices = async (): Promise<PriceResponse> => {
  try {
    const response = await fetch(PRICES_URL);
    return (await response.json()) as PriceResponse;
  } catch (error) {
    console.error(error);
    return {};
  }
};
