import { memo, useMemo } from 'react';
import { usePublicClient } from 'wagmi';

import { type VaultWithApyAndTvl } from '@/actions/get-all-vaults-with-apy-and-tvl';
import { useVaultFees } from '@/hooks/useVaultFees';
import { apiChainToWagmi } from '@/lib/api-chain-to-wagmi';
import { apyFormatter } from '@/lib/apy-formatter';
import { lastHarvestFormatter } from '@/lib/last-harvest-formatter';

export const VaultInfoBlock = memo(
  ({ vault }: { vault: VaultWithApyAndTvl }) => {
    const chainId = apiChainToWagmi(vault.network || '').id;
    const publicClient = usePublicClient({ chainId });
    const { data: feesData, isLoading: isFeesLoading } = useVaultFees(
      vault,
      publicClient,
    );

    const lastHarvest = useMemo(
      () => lastHarvestFormatter(vault.lastHarvest),
      [vault.lastHarvest],
    );

    return (
      <>
        <div className="mb-[4px] flex gap-[4px]">
          <div className="w-full rounded-[6px] bg-[#352852] bg-opacity-[0.4] p-[8px]">
            <h4 className="text-[12px] font-medium leading-[18px] text-light-grey">
              Native APY
            </h4>
            <h5 className="text-[14px] font-semibold leading-[20px] text-primary">
              {apyFormatter(vault.apy.totalApy)}
            </h5>
          </div>
          <div className="w-full rounded-[6px] bg-[#352852] bg-opacity-[0.4] p-[8px]">
            <h4 className="text-[12px] font-medium leading-[18px] text-light-grey">
              Daily APY
            </h4>
            <h5 className="text-[14px] font-semibold leading-[20px] text-primary">
              {apyFormatter(vault.apy.totalApy ? vault.apy.totalApy / 365 : 0)}
            </h5>
          </div>
          <div className="w-full rounded-[6px] bg-[#352852] bg-opacity-[0.4] p-[8px]">
            <h4 className="text-[12px] font-medium leading-[18px] text-light-grey">
              Last harvest
            </h4>
            <h5 className="text-[14px] font-semibold leading-[20px] text-primary">
              {lastHarvest || 'No harvest yet'}
            </h5>
          </div>
        </div>
        <div className="mb-[4px] flex gap-[4px]">
          <div className="flex w-full justify-between rounded-[6px] bg-[#352852] bg-opacity-[0.4] p-[8px]">
            <h4 className="text-[12px] font-medium leading-[18px] text-light-grey">
              Deposit fee
            </h4>
            <h5 className="text-[14px] font-semibold leading-[20px] text-primary">
              {isFeesLoading ? '...' : `${feesData?.depositFee}%`}
            </h5>
          </div>
          <div className="flex w-full justify-between rounded-[6px] bg-[#352852] bg-opacity-[0.4] p-[8px]">
            <h4 className="text-[12px] font-medium leading-[18px] text-light-grey">
              Withdraw fee
            </h4>
            <h5 className="text-[14px] font-semibold leading-[20px] text-primary">
              {isFeesLoading ? '...' : `${feesData?.withdrawFee}%`}
            </h5>
          </div>
        </div>
      </>
    );
  },
);
VaultInfoBlock.displayName = 'VaultInfoBlock';
