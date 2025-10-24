import { type Address } from 'viem';
import { mainnet } from 'viem/chains';

import { apiChainToWagmi } from '@/lib/api-chain-to-wagmi';

const DEFAULT_NETWORK = mainnet.network;

const networkTokenAddresses: {
  [network: string]: {
    stable: { symbol: string; address: Address; decimals: number };
    wrappedNativeToken: { symbol: string; address: Address; decimals: number };
  };
} = {
  arbitrum: {
    stable: {
      symbol: 'USDT',
      address: '0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9',
      decimals: 6,
    },
    wrappedNativeToken: {
      symbol: 'ETH',
      address: '0x82af49447d8a07e3bd95bd0d56f35241523fbab1',
      decimals: 18,
    },
  },
  avalanche: {
    stable: {
      symbol: 'USDT',
      address: '0x9702230A8Ea53601f5cD2dc00fDBc13d4dF4A8c7',
      decimals: 6,
    },
    wrappedNativeToken: {
      symbol: 'AVAX',
      address: '0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7',
      decimals: 18,
    },
  },
  base: {
    stable: {
      symbol: 'USDbC',
      address: '0xd9aAEc86B65D86f6A7B5B1b0c42FFA531710b6CA',
      decimals: 6,
    },
    wrappedNativeToken: {
      symbol: 'ETH',
      address: '0x4200000000000000000000000000000000000006',
      decimals: 18,
    },
  },
  bsc: {
    stable: {
      symbol: 'BSC-USD',
      address: '0x55d398326f99059ff775485246999027b3197955',
      decimals: 18,
    },
    wrappedNativeToken: {
      symbol: 'BNB',
      address: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
      decimals: 18,
    },
  },
  homestead: {
    stable: {
      symbol: 'USDT',
      address: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
      decimals: 6,
    },
    wrappedNativeToken: {
      symbol: 'ETH',
      address: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
      decimals: 18,
    },
  },
  andromeda: {
    stable: {
      symbol: 'USDT',
      address: '0xbb06dca3ae6887fabf931640f67cab3e3a16f4dc',
      decimals: 6,
    },
    wrappedNativeToken: {
      symbol: 'METIS',
      address: '0x75cb093E4D61d2A2e65D8e0BBb01DE8d89b53481',
      decimals: 6,
    },
  },
  optimism: {
    stable: {
      symbol: 'USDT',
      address: '0x94b008aa00579c1307b0ef2c499ad98a8ce58e58',
      decimals: 6,
    },
    wrappedNativeToken: {
      symbol: 'ETH',
      address: '0x4200000000000000000000000000000000000006',
      decimals: 18,
    },
  },
  matic: {
    stable: {
      symbol: 'USDT',
      address: '0xc2132d05d31c914a87c6611c10748aeb04b58e8f',
      decimals: 6,
    },
    wrappedNativeToken: {
      symbol: 'MATIC',
      address: '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270',
      decimals: 18,
    },
  },
  ['polygon-zkevm']: {
    stable: {
      symbol: 'USDT',
      address: '0x1e4a5963abfd975d8c9021ce480b42188849d41d',
      decimals: 6,
    },
    wrappedNativeToken: {
      symbol: 'ETH',
      address: '0x4F9A0e7FD2Bf6067db6994CF12E4495Df938E6e9',
      decimals: 18,
    },
  },
};

export const getNetworkTokenAddresses = (network: string) => {
  const { network: wagmiNetwork } = apiChainToWagmi(network);
  return (
    networkTokenAddresses[wagmiNetwork] ||
    networkTokenAddresses[DEFAULT_NETWORK]
  );
};
