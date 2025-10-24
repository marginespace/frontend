import { createPublicClient, http, type PublicClient } from 'viem';
import {
  arbitrum,
  bsc,
  mainnet,
  metis,
  optimism,
  polygon,
  type Chain,
} from 'viem/chains';

import { forks, isForks } from '@/constants/supported-chains';

export const bscWithoutAnkrChain = {
  ...bsc,
  rpcUrls: {
    public: {
      http: [
        'https://bsc-mainnet.nodereal.io/v1/b5a248cf168c4ec2b2dd113e949c6ccd',
      ],
    },
    default: {
      http: [
        'https://bsc-mainnet.nodereal.io/v1/b5a248cf168c4ec2b2dd113e949c6ccd',
      ],
    },
  },
};

export const arbitrumWithNormalRpc = {
  ...arbitrum,
  rpcUrls: {
    public: {
      http: [
        'https://arbitrum-mainnet.infura.io/v3/294b02c6ce6a4c4c92ff7e3e95beeb29',
      ],
    },
    default: {
      http: [
        'https://arbitrum-mainnet.infura.io/v3/294b02c6ce6a4c4c92ff7e3e95beeb29',
      ],
    },
  },
};

export const polygonWithNormalRpc = {
  ...polygon,
  rpcUrls: {
    public: {
      http: [
        'https://polygon-mainnet.infura.io/v3/294b02c6ce6a4c4c92ff7e3e95beeb29',
      ],
    },
    default: {
      http: [
        'https://polygon-mainnet.infura.io/v3/294b02c6ce6a4c4c92ff7e3e95beeb29',
      ],
    },
  },
};

export const optimismWithNormalRpc = {
  ...optimism,
  rpcUrls: {
    public: {
      http: [
        'https://optimism-mainnet.infura.io/v3/294b02c6ce6a4c4c92ff7e3e95beeb29',
      ],
    },
    default: {
      http: [
        'https://optimism-mainnet.infura.io/v3/294b02c6ce6a4c4c92ff7e3e95beeb29',
      ],
    },
  },
};

export const baseWithNormalRpc = {
  ...optimism,
  rpcUrls: {
    public: {
      http: [
        'https://open-platform.nodereal.io/b5a248cf168c4ec2b2dd113e949c6ccd/base',
      ],
    },
    default: {
      http: [
        'https://open-platform.nodereal.io/b5a248cf168c4ec2b2dd113e949c6ccd/base',
      ],
    },
  },
};

const chains: Record<string, Chain> = {
  ...(isForks
    ? forks
    : {
        ethereum: mainnet,
        metis: metis,
        base: baseWithNormalRpc,
        bsc: bscWithoutAnkrChain,
        arbitrum: arbitrumWithNormalRpc,
        polygon: polygonWithNormalRpc,
        optimism: optimismWithNormalRpc,
      }),
};

const publicClients: Record<string, PublicClient> = Object.entries(
  chains,
).reduce(
  (acc, [apiChain, wagmiChain]) => {
    acc[apiChain] = createPublicClient({
      chain: wagmiChain,
      transport: http(undefined, { fetchOptions: { cache: 'no-cache' } }),
    });
    return acc;
  },
  {} as Record<string, PublicClient>,
);

export const apiChainToWagmi = (apiChain: string) => {
  const chain = chains[apiChain];
  return chain ?? chains['ethereum'];
};

export const apiChainToPublicClient = (apiChain: string) => {
  const publicClient = publicClients[apiChain];
  return publicClient ?? publicClients['ethereum'];
};
