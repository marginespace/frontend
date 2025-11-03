interface Filter {
  value: boolean;
  type: 'switch' | 'chain' | 'platform';
  name: string;
  title: string;
  image?: string;
  tooltip?: string;
}

// TODO: CHANGE NAMES FOR FILTER
export const earnFilters: Filter[] = [
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
