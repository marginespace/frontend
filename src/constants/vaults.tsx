import { type ReactNode } from 'react';

import { BadgeDollarSign, Fire, Star } from '@/components/ui/icons';
import {
  ChainsArbitrum,
  ChainsAvax,
  ChainsBase,
  ChainsBsc,
  ChainsEthereum,
  ChainsOptimism,
  ChainsPolygon,
  ChainsZkEvm,
} from '@/ui/icons';

export enum VaultPoolRate {
  MOST_POPULAR = 'Most Popular',
  HOT = 'Hot Vault',
  MOST_PROFITABLE = 'Most Profitable',
}

export interface PromotionalPoolCardItem {
  name: string;
  rate: VaultPoolRate;
  apy: string;
  platform: string;
  color: string;
  icon: ReactNode;
}

export const vaultsData: PromotionalPoolCardItem[] = [
  {
    name: 'OP',
    rate: VaultPoolRate.MOST_POPULAR,
    apy: '9.06%',
    platform: 'ALIENBASE',
    color: '#E9C268',
    icon: <Star className="fill-white" />,
  },
  {
    name: 'ETH-USDbC',
    rate: VaultPoolRate.HOT,
    apy: '109.06%',
    platform: 'ALIENBASE',
    color: '#D85F5A',
    icon: <Fire className="fill-white" />,
  },
  {
    name: 'Gyroscope wstETH-cbETH',
    rate: VaultPoolRate.MOST_PROFITABLE,
    apy: '2229.06%',
    platform: 'ALIENBASE',
    color: '#59B38A',
    icon: <BadgeDollarSign className="fill-white" />,
  },
];

export type VaultsTabValue = 'all' | 'my' | 'saved';

type VaultsTabDataItem = {
  value: VaultsTabValue;
  label: string;
};

export const vaultsTabsData: VaultsTabDataItem[] = [
  { value: 'all', label: 'All Vaults' },
  { value: 'my', label: 'My Vaults' },
  { value: 'saved', label: 'Saved Vaults' },
];

export const networkIdToName: Record<number, string> = {
  1: 'ethereum',
  31337: 'ethereum',
  56: 'bsc',
  137: 'polygon',
  42161: 'arbitrum',
  43114: 'avax',
  8453: 'base',
  10: 'optimism',
};

export const chainImages: Record<string, ReactNode> = {
  ethereum: (
    <div className="flex h-[24px] w-[34px] justify-center rounded-lg bg-[#6F7BBA]">
      <ChainsEthereum />
    </div>
  ),
  avax: (
    <div className="flex h-[24px] w-[34px] justify-center rounded-lg bg-[#E84142]">
      <ChainsAvax />
    </div>
  ),
  base: (
    <div className="flex h-[24px] w-[34px] justify-center rounded-lg bg-[#FFFFFF]">
      <ChainsBase />
    </div>
  ),
  bsc: (
    <div className="flex h-[24px] w-[34px] justify-center rounded-lg bg-[#F0B90B]">
      <ChainsBsc />
    </div>
  ),
  optimism: (
    <div className="flex h-[24px] w-[34px] justify-center rounded-lg bg-[#FF0420]">
      <ChainsOptimism />
    </div>
  ),
  polygon: (
    <div className="flex h-[24px] w-[34px] justify-center rounded-lg bg-[#F5F0FD]">
      <ChainsPolygon />
    </div>
  ),
  zkevm: (
    <div className="flex h-[24px] w-[34px] justify-center rounded-lg bg-gradient-to-br from-[#992FCE] to-[#7A40E5]">
      <ChainsZkEvm />
    </div>
  ),
  arbitrum: (
    <div className="flex h-[24px] w-[34px] justify-center rounded-lg bg-[#0088D2]">
      <ChainsArbitrum />
    </div>
  ),
};
