import { API_URL } from '@/constants/api';

export interface ChainConfig {
  devMultisig: string;
  treasuryMultisig: string;
  multicallManager: string;
  strategyOwner: string;
  vaultOwner: string;
  keeper: string;
  treasurer: string;
  launchpoolOwner: string;
  rewardPool: string;
  treasury: string;
  feeRecipient: string;
  cuberaMaxiStrategy: string;
  voter: string;
  feeConfig: string;
  earnPriceAggregator: string;
  earnConfiguration: string;
  earnGelatoChecker: string;
  earnFactory: string;
  earnBeacon: string;
  earnHelper: string;
  ac: string;
  wNative: string;
  gelatoAutomate: string;
  oneInchRouter: string;
  uniswapV3Quoter: string;
}

export const getChainConfig = async (): Promise<
  Record<string, ChainConfig>
> => {
  try {
    const CHAIN_URL = API_URL + '/config';

    const response = await fetch(CHAIN_URL);
    return (await response.json()) as Record<string, ChainConfig>;
  } catch (error) {
    console.error(error);
    return {};
  }
};
