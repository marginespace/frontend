import { createPublicClient, http, type PublicClient } from 'viem';
import {
  arbitrum,
  bsc,
  mainnet,
  metis,
  optimism,
  avalanche,
  polygon,
  base,
  type Chain,
} from 'viem/chains';

import { forks, isForks } from '@/constants/supported-chains';

export const bscWithoutAnkrChain = {
  ...bsc,
  rpcUrls: {
    public: {
      http: [
        process.env.NEXT_PUBLIC_RPC_BSC ||
          'https://bsc-mainnet.infura.io/v3/80792385aff54a83afe1368e2d719ec0',
      ],
    },
    default: {
      http: [
        process.env.NEXT_PUBLIC_RPC_BSC ||
          'https://bsc-mainnet.infura.io/v3/80792385aff54a83afe1368e2d719ec0',
      ],
    },
  },
};

export const arbitrumWithNormalRpc = {
  ...arbitrum,
  rpcUrls: {
    public: {
      http: [
        process.env.NEXT_PUBLIC_RPC_ARBITRUM ||
          'https://arbitrum-mainnet.infura.io/v3/80792385aff54a83afe1368e2d719ec0',
      ],
    },
    default: {
      http: [
        process.env.NEXT_PUBLIC_RPC_ARBITRUM ||
          'https://arbitrum-mainnet.infura.io/v3/80792385aff54a83afe1368e2d719ec0',
      ],
    },
  },
};

export const polygonWithNormalRpc = {
  ...polygon,
  rpcUrls: {
    public: {
      http: [
        process.env.NEXT_PUBLIC_RPC_POLYGON ||
          'https://polygon-mainnet.infura.io/v3/294b02c6ce6a4c4c92ff7e3e95beeb29',
      ],
    },
    default: {
      http: [
        process.env.NEXT_PUBLIC_RPC_POLYGON ||
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
        process.env.NEXT_PUBLIC_RPC_OPTIMISM ||
          'https://optimism-mainnet.infura.io/v3/80792385aff54a83afe1368e2d719ec0',
      ],
    },
    default: {
      http: [
        process.env.NEXT_PUBLIC_RPC_OPTIMISM ||
          'https://optimism-mainnet.infura.io/v3/80792385aff54a83afe1368e2d719ec0',
      ],
    },
  },
};

export const baseWithNormalRpc = {
  ...base,
  rpcUrls: {
    public: {
      http: [
        process.env.NEXT_PUBLIC_RPC_BASE ||
          'https://base-mainnet.infura.io/v3/80792385aff54a83afe1368e2d719ec0',
      ],
    },
    default: {
      http: [
        process.env.NEXT_PUBLIC_RPC_BASE ||
          'https://base-mainnet.infura.io/v3/80792385aff54a83afe1368e2d719ec0',
      ],
    },
  },
};

export const avalancheWithNormalRpc = {
  ...avalanche,
  rpcUrls: {
    public: {
      http: [
        process.env.NEXT_PUBLIC_RPC_AVALANCHE ||
          'https://avalanche-mainnet.infura.io/v3/80792385aff54a83afe1368e2d719ec0',
      ],
    },
    default: {
      http: [
        process.env.NEXT_PUBLIC_RPC_AVALANCHE ||
          'https://avalanche-mainnet.infura.io/v3/80792385aff54a83afe1368e2d719ec0',
      ],
    },
  },
};

export const mainnetWithCorsFriendlyRpc = {
  ...mainnet,
  rpcUrls: {
    public: {
      http: [
        process.env.NEXT_PUBLIC_RPC_ETHEREUM ||
          'https://mainnet.infura.io/v3/294b02c6ce6a4c4c92ff7e3e95beeb29',
      ],
    },
    default: {
      http: [
        process.env.NEXT_PUBLIC_RPC_ETHEREUM ||
          'https://mainnet.infura.io/v3/294b02c6ce6a4c4c92ff7e3e95beeb29',
      ],
    },
  },
};

const chains: Record<string, Chain> = {
  ...(isForks
    ? forks
    : {
        ethereum: mainnetWithCorsFriendlyRpc,
        metis: metis,
        base: baseWithNormalRpc,
        bsc: bscWithoutAnkrChain,
        arbitrum: arbitrumWithNormalRpc,
        avax: avalancheWithNormalRpc,
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
