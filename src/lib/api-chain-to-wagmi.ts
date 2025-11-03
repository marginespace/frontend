import { createPublicClient, http, type PublicClient } from 'viem';
import { metis, type Chain } from 'viem/chains';

import { forks, isForks } from '@/constants/supported-chains';
import {
  bscWithoutAnkrChain,
  arbitrumWithNormalRpc,
  optimismWithNormalRpc,
  baseWithNormalRpc,
  avalancheWithNormalRpc,
  mainnetWithCorsFriendlyRpc,
  polygonWithNormalRpc,
} from '@/lib/custom-chains';

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
