import { API_URL } from '@/constants/api';

const SWAP_URL = API_URL + '/oneinch/{chain}/swap';

export type OneInchSwapEstimateResponse = {
  fromToken: {
    address: string;
    symbol: string;
    name: string;
    decimals: number;
    logoURI: string;
    tags: string[];
  };
  toToken: {
    address: string;
    symbol: string;
    name: string;
    decimals: number;
    eip2612: boolean;
    logoURI: string;
    tags: string[];
  };
  estimatedGas: number;
  protocols: {
    name: string;
    part: number;
    fromTokenAddress: string;
    toTokenAddress: string;
  }[][];
  toTokenAmount: string;
  fromTokenAmount: string;
  tx: {
    from: string;
    to: string;
    data: string;
    value: string;
    gas: number;
    gasPrice: string;
  };
};

export type EstimateRequest = {
  network: string;
  from: string;
  receiver?: string;
  amount: bigint;
  src: string;
  dst: string;
  referrer?: string;
  slippage: number;
  disableEstimate: boolean;
  signal?: AbortSignal;
};

const chainIds: Record<string, number> = {
  ethereum: 1,
  bsc: 56,
  arbitrum: 42161,
  polygon: 137,
  avax: 43114,
  optimism: 10,
  base: 8453,
};

export const oneInchEstimate = async (
  params: EstimateRequest,
): Promise<OneInchSwapEstimateResponse> => {
  try {
    if (!chainIds[params.network]) throw new Error('Unsupported network');

    const url = new URL(
      SWAP_URL.replace('{chain}', chainIds[params.network].toString()),
      undefined,
    );

    url.searchParams.set('from', params.from);
    url.searchParams.set('amount', params.amount.toString());
    url.searchParams.set('src', params.src);
    url.searchParams.set('dst', params.dst);
    url.searchParams.set('referrer', params.referrer ?? params.from);
    url.searchParams.set('slippage', params.slippage.toString());
    url.searchParams.set('disableEstimate', params.disableEstimate.toString());
    url.searchParams.set(
      'receiver',
      params.receiver?.toString() ?? params.from,
    );

    const headers: Record<string, string> = {};
    if (API_URL.includes('ngrok') || API_URL.includes('localhost')) {
      headers['ngrok-skip-browser-warning'] = '69420';
    }

    const response = await fetch(url.toString(), {
      signal: params.signal,
      headers,
    });
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const parseResponse =
      (await response.json()) as OneInchSwapEstimateResponse;
    return parseResponse;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
