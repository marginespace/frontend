import { type BlockTag } from 'viem';
import {
  arbitrum,
  // mainnet,
  optimism,
  base,
  avalanche,
  type Chain,
} from 'viem/chains';

import {
  bscWithoutAnkrChain,
  arbitrumWithNormalRpc,
  optimismWithNormalRpc,
  baseWithNormalRpc,
  avalancheWithNormalRpc,
} from '@/lib/custom-chains';

export const isForks = process.env.NEXT_PUBLIC_FORKS === 'true';

// const ethForkUrl =
//   process.env.NEXT_PUBLIC_ETH_FORK_URL || 'http://localhost:8545';
// const bscForkUrl =
//   process.env.NEXT_PUBLIC_BSC_FORK_URL || 'http://localhost:9545';
// const arbitrumForkUrl =
//   process.env.NEXT_PUBLIC_ARBITRUM_FORK_URL || 'http://localhost:11545';
// const polygonForkUrl =
//   process.env.NEXT_PUBLIC_POLYGON_FORK_URL || 'http://localhost:10545';
// const optimismForkUrl =
//   process.env.NEXT_PUBLIC_OPTIMISM_FORK_URL || 'http://localhost:12545';
// const avaxForkUrl =
//   process.env.NEXT_PUBLIC_AVAX_FORK_URL || 'http://localhost:13545';

const baseForkUrl =
  process.env.NEXT_PUBLIC_BASE_FORK_URL || 'http://localhost:14545';

export const forks = {
  // ethereum: {
  //   ...mainnet,
  //   id: 31337,
  //   rpcUrls: {
  //     public: {
  //       http: [ethForkUrl],
  //       webSocket: [],
  //     },
  //     default: {
  //       http: [ethForkUrl],
  //       webSocket: [],
  //     },
  //   },
  //   contracts: {
  //     ...mainnet.contracts,
  //     multicall3: {
  //       address: mainnet.contracts.multicall3.address,
  //       blockCreated: 0,
  //     },
  //   },
  // },
  // bsc: {
  //   ...bsc,
  //   id: 31338,
  //   rpcUrls: {
  //     ...bsc.rpcUrls,
  //     public: {
  //       http: [bscForkUrl],
  //       webSocket: [],
  //     },
  //     default: { http: [bscForkUrl], webSocket: [] },
  //   },
  // },
  // arbitrum: {
  //   ...arbitrum,
  //   id: 31340,
  //   rpcUrls: {
  //     public: {
  //       http: [arbitrumForkUrl],
  //       webSocket: [],
  //     },
  //     default: {
  //       http: [arbitrumForkUrl],
  //       webSocket: [],
  //     },
  //   },
  //   contracts: {
  //     ...arbitrum.contracts,
  //     multicall3: {
  //       address: arbitrum.contracts.multicall3.address,
  //       blockCreated: 0,
  //     },
  //   },
  // },
  // polygon: {
  //   ...polygon,
  //   id: 31339,
  //   rpcUrls: {
  //     public: {
  //       http: [polygonForkUrl],
  //       webSocket: [],
  //     },
  //     default: {
  //       http: [polygonForkUrl],
  //       webSocket: [],
  //     },
  //   },
  //   contracts: {
  //     ...polygon.contracts,
  //     multicall3: {
  //       address: polygon.contracts.multicall3.address,
  //       blockCreated: 0,
  //     },
  //   },
  // },
  // optimism: {
  //   ...optimism,
  //   id: 31341,
  //   rpcUrls: {
  //     public: {
  //       http: [optimismForkUrl],
  //       webSocket: [],
  //     },
  //     default: {
  //       http: [optimismForkUrl],
  //       webSocket: [],
  //     },
  //   },
  //   contracts: {
  //     ...optimism.contracts,
  //     multicall3: {
  //       address: optimism.contracts.multicall3.address,
  //       blockCreated: 0,
  //     },
  //   },
  // },
  // avalanche: {
  //   ...avalanche,
  //   id: 31342,
  //   rpcUrls: {
  //     public: {
  //       http: [avalancheForkUrl],
  //       webSocket: [],
  //     },
  //     default: {
  //       http: [avalancheForkUrl],
  //       webSocket: [],
  //     },
  //   },
  //   contracts: {
  //     ...avalanche.contracts,
  //     multicall3: {
  //       address: avalanche.contracts.multicall3.address,
  //       blockCreated: 0,
  //     },
  //   },
  // },
  base: {
    ...base,
    id: 31343,
    rpcUrls: {
      public: {
        http: [baseForkUrl],
        webSocket: [],
      },
      default: {
        http: [baseForkUrl],
        webSocket: [],
      },
    },
    contracts: {
      ...base.contracts,
      multicall3: {
        address: base.contracts.multicall3.address,
        blockCreated: 0,
      },
    },
  },
} satisfies Record<string, Chain>;

export const SUPPORTED_CHAINS: Chain[] = [
  ...(isForks ? Object.values(forks) : []),
  arbitrumWithNormalRpc,
  avalancheWithNormalRpc,
  baseWithNormalRpc,
  bscWithoutAnkrChain,
  optimismWithNormalRpc,
];

export const earliestBlocks: Record<string, bigint | BlockTag> = {
  ethereum: 'earliest',
  bsc: BigInt(66698902), // 33888428
  arbitrum: BigInt(395669445), // 154537254
  // polygon: BigInt(53144883), // 50616384 (temporarily hidden)
  avalanche: BigInt(71253265), // 38921921
  base: BigInt(37588598), // 7924196
  optimism: BigInt(143213433), // 113440044
};
