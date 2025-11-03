import {
  arbitrum,
  bsc,
  mainnet,
  optimism,
  avalanche,
  polygon,
  base,
  type Chain,
} from 'viem/chains';

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
