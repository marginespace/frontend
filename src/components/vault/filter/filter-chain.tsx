'use client';

import { Checkbox, CheckboxIndicator } from '@/components/ui/checkbox';
import ChainsArbitrum from '@/components/ui/icons/chains-arbitrum';
import ChainsAvax from '@/components/ui/icons/chains-avax';
import ChainsBase from '@/components/ui/icons/chains-base';
import ChainsBsc from '@/components/ui/icons/chains-bsc';
import ChainsEthereum from '@/components/ui/icons/chains-ethereum';
import ChainsOptimism from '@/components/ui/icons/chains-optimism';
import ChainsPolygon from '@/components/ui/icons/chains-polygon';
import ChainsZkEvm from '@/components/ui/icons/chains-zkevm';

type Props = {
  imgUrl?: string;
  title: string;
  name: string;
  checked: boolean;
  handleChange: (name: string, val: boolean) => void;
};

export const chainImages: Record<string, JSX.Element> = {
  ethereum: <ChainsEthereum />,
  avax: <ChainsAvax />,
  base: <ChainsBase />,
  bsc: <ChainsBsc />,
  optimism: <ChainsOptimism />,
  polygon: <ChainsPolygon />,
  zkevm: <ChainsZkEvm />,
  arbitrum: <ChainsArbitrum />,
};

export const FilterChain = ({
  title,
  name,
  handleChange,
  checked,
  imgUrl,
}: Props) => {
  return (
    <div className="mb-[4px] flex justify-between py-[8px]">
      <div className="mr-3 flex items-center">
        {imgUrl ? (
          <div className="next-image-wrapper relative mr-[8px] h-[24px] w-[24px]">
            {chainImages[name.slice(7)]}
          </div>
        ) : (
          <div className="mr-[8px] h-[24px] w-[24px] rounded-full bg-gray-700"></div>
        )}

        <label htmlFor={name} className=" text-[14px] font-medium text-text">
          {title}
        </label>
      </div>
      <Checkbox
        checked={checked}
        onCheckedChange={(val) => handleChange(name, Boolean(val))}
        id={name}
        className="flex items-center justify-center"
      >
        <CheckboxIndicator />
      </Checkbox>
    </div>
  );
};
