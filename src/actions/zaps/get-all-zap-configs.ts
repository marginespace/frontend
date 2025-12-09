import { API_URL } from '@/constants/api';

const ZAP_CONFIGS_URL = API_URL + '/oneinch/';

export enum ZapCategory {
  COMMON = 'common',
  CURVE_CONVEX_ETH = 'curve-convex-eth',
  CURVE_OP = 'curve-op',
  BALANCER_AURA_ETH = 'balancer-aura-eth',
  BALANCER_AURA_ARBITRUM = 'balancer-aura-arbitrum',
  RETRO_GAMMA = 'retro-gamma',
  HOP = 'hop',
  VELODROME = 'velodrome',
}

export type ZapConfigsResponse = {
  priceOracleAddress: string;
  chainId: string;
  fee: {
    value: number;
    recipient: string;
  };
  depositFromTokens: string[];
  withdrawToTokens: string[];
  blockedTokens: string[];
  blockedVaults: string[];
  strategies: {
    address: string;
    category: ZapCategory;
  }[];
}[];

export const getAllZapConfigs = async (): Promise<ZapConfigsResponse> => {
  try {
    const headers: Record<string, string> = {};
    if (API_URL.includes('ngrok') || API_URL.includes('localhost')) {
      headers['ngrok-skip-browser-warning'] = '69420';
    }

    const response = await fetch(ZAP_CONFIGS_URL, { headers });

    if (!response.ok) {
      // If service is unavailable (503), return empty array
      if (response.status === 503) {
        console.warn('[getAllZapConfigs] Zap service is not available yet');
        return [];
      }
      // For other errors, try to parse JSON error message
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
      console.error('[getAllZapConfigs] API error:', response.status, errorData);
      return [];
    }

    return (await response.json()) as ZapConfigsResponse;
  } catch (error) {
    console.error('[getAllZapConfigs] Error:', error);
    return [];
  }
};
