import { type PublicClient } from 'wagmi';

import { type VaultWithApyAndTvl } from '@/actions/get-all-vaults-with-apy-and-tvl';
import { TooltipItem } from '@/components/tooltip-item';
import { useVaultFees } from '@/hooks/useVaultFees';

export const TradeInfo = ({
  vault,
  publicClient,
}: {
  vault: VaultWithApyAndTvl;
  publicClient: PublicClient;
}) => {
  const { data: feesData, isLoading: isFeesLoading } = useVaultFees(
    vault,
    publicClient,
  );

  return (
    <div className="flex flex-col gap-[8px] py-[10px]">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-[8px]">
          <div className="text-[12px]">DEPOSIT FEE</div>
          <TooltipItem contentClassName="text-sm">
            Fee for deposit charged by the provider or Margin Space
          </TooltipItem>
        </div>
        <div className="text-[14px]">
          {isFeesLoading ? '...' : `${feesData?.depositFee}%`}
        </div>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-[8px]">
          <div className="text-[12px]">WITHDRAWAL FEE</div>
          <TooltipItem contentClassName="text-sm">
            Fee for withdrawal charged by the provider or Margin Space
          </TooltipItem>
        </div>
        <div className="text-[14px]">
          {isFeesLoading ? '...' : `${feesData?.withdrawFee}%`}
        </div>
      </div>
      <p className="text-[12px]">
        The displayed APY accounts for performance fee that is deducted from the
        generated yield only.
      </p>
    </div>
  );
};
