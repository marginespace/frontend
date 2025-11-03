import Image from 'next/image';
import { type HTMLAttributes } from 'react';

import { type VaultWithApyAndTvl } from '@/actions/get-all-vaults-with-apy-and-tvl';
import { ApyBreakdownItem } from '@/components/vault/vault-details/strategy/apy-breakdown-item';
import { getTokenAssetUrl } from '@/constants/assets';
import { apyFormatter } from '@/lib/apy-formatter';
import { cn } from '@/lib/utils';

export type IBreakdownItemProps = {
  // max length = 2
  vault: VaultWithApyAndTvl;
} & HTMLAttributes<HTMLDivElement>;

export const BreakdownItem = ({
  vault,
  className,
  ...props
}: IBreakdownItemProps) => {
  return (
    <div
      className={cn(
        'box-border flex cursor-pointer flex-col gap-[8px] rounded-[8px] border-[1px] border-transparent bg-[rgba(255,255,255,0.08)] p-[16px] transition-all hover:border-white md:p-[8px]',
        className,
      )}
      {...props}
    >
      <div className="w-full md:h-[40px]">
        <div className="flex items-center gap-[8px]">
          <div className="flex items-center gap-[2px]">
            {vault.assets.map((asset) => (
              <Image
                key={asset}
                width={16}
                height={16}
                src={getTokenAssetUrl(asset)}
                alt={asset}
              />
            ))}
          </div>
          <div className="text-[14px] font-bold text-white">{vault.name}</div>
        </div>
      </div>
      <div className="flex flex-row items-center justify-between gap-[2px] md:flex-col md:items-start md:justify-normal">
        <div className="text-[12px] font-[400] text-text-purple">Platform</div>
        <div className="text-[14px] font-bold leading-[20px] text-white">
          {vault.platformId.toUpperCase()}
        </div>
      </div>
      <ApyBreakdownItem
        className="border-none bg-transparent-bg-dark"
        label="Total APY"
      >
        {apyFormatter(vault.apy.totalApy)}
      </ApyBreakdownItem>
    </div>
  );
};
