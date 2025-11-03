import {
  ChainsArbitrum,
  ChainsAvax,
  ChainsBase,
  ChainsBsc,
  ChainsEthereum,
  ChainsOptimism,
  ChainsPolygon,
  ChainsZkEvm,
} from '@/components/ui/icons';

export const chainsById: Record<string, JSX.Element> = {
  1: <ChainsEthereum />,
  31337: <ChainsEthereum />,
  43114: <ChainsAvax />,
  8453: <ChainsBase />,
  56: <ChainsBsc />,
  10: <ChainsOptimism />,
  137: <ChainsPolygon />,
  1101: <ChainsZkEvm />,
  42161: <ChainsArbitrum />,
};
