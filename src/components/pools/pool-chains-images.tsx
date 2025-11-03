import ChainsArbitrum from '../ui/icons/chains-arbitrum';
import ChainsAvax from '../ui/icons/chains-avax';
import ChainsBase from '../ui/icons/chains-base';
import ChainsBsc from '../ui/icons/chains-bsc';
import ChainsEthereum from '../ui/icons/chains-ethereum';
import ChainsOptimism from '../ui/icons/chains-optimism';
import ChainsPolygon from '../ui/icons/chains-polygon';
import ChainsZkEvm from '../ui/icons/chains-zkevm';

export const poolChainsImages = {
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
