import { type PublicClient } from 'wagmi';

import { type CubeWithApyAndTvl } from '@/actions/get-all-cubes';
import { TooltipItem } from '@/components/tooltip-item';
import { useEarnFees } from '@/hooks/useEarnFees';

export const InteractionInfo = ({
  cube,
  publicClient,
}: {
  cube: CubeWithApyAndTvl;
  publicClient: PublicClient;
}) => {
  const { data, isLoading } = useEarnFees(cube, publicClient);

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
          {isLoading ? '...' : `${(data?.depositFee || 0).toFixed(2)}%`}
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
          {isLoading ? '...' : `${(data?.withdrawFee || 0).toFixed(2)}%`}
        </div>
      </div>
      <p className="text-[12px] [&>span]:ml-[2px] [&>span]:mr-1">
        The displayed APY accounts for performance fee that is deducted from the
        generated yield only.
      </p>
    </div>
  );
};
