export interface IFilter {
  value: boolean;
  type: 'switch' | 'chain' | 'platform';
  name: string;
  title: string;
  image?: string;
  tooltip?: string;
}

// TODO: CHANGE NAMES FOR FILTER
export const poolFilters: IFilter[] = [
  {
    value: false,
    type: 'switch',
    name: 'boost',
    title: 'Boost',
  },
  {
    value: false,
    type: 'switch',
    name: 'lp',
    title: 'LP',
    tooltip: 'Add',
  },
  {
    value: false,
    type: 'switch',
    name: 'single',
    title: 'Single',
    tooltip: 'Add',
  },
  {
    value: false,
    type: 'switch',
    name: 'featured',
    title: 'Featured',
    tooltip: 'Add',
  },
  {
    value: false,
    type: 'switch',
    name: 'stablecoins',
    title: 'Stablecoins',
    tooltip: 'Add',
  },
  {
    value: false,
    type: 'switch',
    name: 'blueChip',
    title: 'Blue Chip',
    tooltip: 'Add',
  },
  {
    value: false,
    type: 'switch',
    name: 'correlated',
    title: 'Correlated',
    tooltip: 'Add',
  },
  {
    value: false,
    type: 'switch',
    name: 'retired',
    title: 'Retired Vaults',
    tooltip: 'Add',
  },
  {
    value: false,
    type: 'switch',
    name: 'paused',
    title: 'Paused Vaults',
    tooltip: 'Add',
  },
  // Chains
  // {
  //   value: false,
  //   type: 'chain',
  //   name: 'ethereum',
  //   title: 'Ethereum',
  //   image: '/chain_eth.png',
  // },
  // {
  //   value: false,
  //   type: 'chain',
  //   name: 'polygon',
  //   title: 'Polygon PoS',
  //   image: '/chain_polygon.png',
  // },
  {
    value: false,
    type: 'chain',
    name: 'bsc',
    title: 'BSC',
    image: '/chain_bsc.png',
  },
  {
    value: false,
    type: 'chain',
    name: 'optimism',
    title: 'Optimism',
    image: '/chain_op.png',
  },
  {
    value: false,
    type: 'chain',
    name: 'arbitrum',
    title: 'Arbitrum',
    image: '/chain_arb.png',
  },
  {
    value: false,
    type: 'chain',
    name: 'avax',
    title: 'Avalanche',
    image: '/chain_avax.png',
  },
  // {
  //   value: false,
  //   type: 'chain',
  //   name: 'zkevm',
  //   title: 'Polygon zkEVM',
  //   image: '/chain_zkEvm.png',
  // },
  {
    value: false,
    type: 'chain',
    name: 'base',
    title: 'Base',
    image: '/chain_base.png',
  },
];
