import { API_URL } from '@/constants/api';

const TVL_URL = API_URL + '/tvl';

export type Tvls = Record<string, number>;
export type TvlResponse = Record<`${number}`, Tvls>;

export const getAllTvls = async (): Promise<Tvls> => {
  try {
    const response = await fetch(TVL_URL);
    const tvls = (await response.json()) as TvlResponse;
    return Object.entries(tvls).reduce(
      (acc, [, value]) => ({
        ...acc,
        ...value,
      }),
      {} as Tvls,
    );
  } catch (error) {
    console.error(error);
    return {};
  }
};
