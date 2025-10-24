import { DescriptionItem } from './description-item';

import { type VaultWithApyAndTvl } from '@/actions/get-all-vaults-with-apy-and-tvl';
import { TooltipItem } from '@/components/tooltip-item';
import { apyFormatter } from '@/lib/apy-formatter';
import { lastHarvestFormatter } from '@/lib/last-harvest-formatter';
import { tvlFormatter } from '@/lib/tvl-formatter';

type Props = {
  vault: VaultWithApyAndTvl;
};

export const VaultMetrics = ({ vault }: Props) => {
  return (
    <div className="flex flex-col justify-between gap-[20px] rounded-[16px] bg-[rgba(14,18,27,0.4)] bg-opacity-[0.80] p-[16px] lg:flex-row lg:gap-0">
      <div className="flex flex-col gap-[20px]">
        <DescriptionItem name="APY" value={apyFormatter(vault.apy.totalApy)} />
        <DescriptionItem
          name="TVL"
          value={tvlFormatter(vault.tvl, 2)}
          icon={
            <TooltipItem>
              <p className="text-sm font-medium text-text-light">
                Total value locked: the value of digital assets locked or staked
                in a particular vault
              </p>
            </TooltipItem>
          }
        />
        <DescriptionItem
          name="Last Harvest"
          value={lastHarvestFormatter(vault.lastHarvest) || 'No harvest yet'}
        />
      </div>
      <div className="flex flex-col gap-[20px] lg:items-end">
        <DescriptionItem name="Chain:" value={vault.chain} />
        <DescriptionItem name="Platform:" value={vault.platformId} />
      </div>
    </div>
  );
};
