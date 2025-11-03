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
    <div className="group flex items-center justify-between rounded-lg px-3 py-2 transition-colors hover:bg-primary/10">
      <div className="flex items-center gap-2.5">
        {imgUrl ? (
          <div className="next-image-wrapper relative h-[22px] w-[22px]">
            {chainImages[name]}
          </div>
        ) : (
          <div className="h-[22px] w-[22px] rounded-full bg-gray-300"></div>
        )}

        <label 
          htmlFor={name} 
          className="cursor-pointer text-[14px] font-medium text-[#374151] transition-colors group-hover:text-[#111827]"
        >
          {title}
        </label>
      </div>
      <Checkbox
        checked={checked}
        onCheckedChange={(val) => handleChange(name, Boolean(val))}
        id={name}
        className="flex items-center justify-center border-primary data-[state=checked]:bg-primary"
      >
        <CheckboxIndicator />
      </Checkbox>
    </div>
  );
};
