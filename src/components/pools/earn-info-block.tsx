import { useIsMounted } from '@redduck/helpers-react';
import { memo } from 'react';
import { type Address, formatUnits } from 'viem';
import { useAccount, useContractRead, usePublicClient } from 'wagmi';

import { earnPoolCheckerAbi } from '@/abi/earn/EarnPoolChecker';
import { type CubeWithApyAndTvl } from '@/actions/get-all-cubes';
import { useEarnFees } from '@/hooks/useEarnFees';
import { apiChainToWagmi } from '@/lib/api-chain-to-wagmi';

export const EarnInfoBlock = memo(({ cube }: { cube: CubeWithApyAndTvl }) => {
  const chainId = apiChainToWagmi(cube.network).id;
  const publicClient = usePublicClient({ chainId });
  const isMounted = useIsMounted();
  const { address } = useAccount();

  const { data: stableReceived } = useContractRead({
    abi: earnPoolCheckerAbi,
    address: cube.gelatoChecker as Address,
    // todo: why is this not working?
    // @ts-expect-error Type 'string' is not assignable to type 'undefined'
    functionName: 'stableReceivedStopLoss',
    args: address ? [cube.earn as Address, address] : undefined,
    chainId: apiChainToWagmi(cube.network).id,
    watch: true,
  });
  const { data, isLoading } = useEarnFees(cube, publicClient);

  const deposit =
    isMounted && stableReceived ? +formatUnits(stableReceived[0], 18) : 0;

  return (
    <div className="flex flex-col gap-1">
      <div className="flex flex-row gap-1 md:flex-col">
        <div className="flex w-full justify-between rounded-[6px] bg-[#352852] bg-opacity-[0.4] p-[8px]">
          <h4 className="text-[12px] font-medium leading-[18px] text-light-grey">
            Deposit fee
          </h4>
          <h5 className="text-[14px] font-semibold leading-[20px] text-primary">
            {isLoading ? '...' : `${data?.depositFee}%`}
          </h5>
        </div>
        <div className="flex w-full justify-between rounded-[6px] bg-[#352852] bg-opacity-[0.4] p-[8px]">
          <h4 className="text-[12px] font-medium leading-[18px] text-light-grey">
            Withdraw fee
          </h4>
          <h5 className="text-[14px] font-semibold leading-[20px] text-primary">
            {isLoading ? '...' : `${data?.withdrawFee}%`}
          </h5>
        </div>
      </div>
      <div className="flex gap-[4px]">
        <div className="flex w-full justify-between rounded-[6px] bg-[#352852] bg-opacity-[0.4] p-[8px]">
          <h4 className="text-[12px] font-medium leading-[18px] text-light-grey">
            Deposited
          </h4>
          <h5 className="text-[14px] font-semibold leading-[20px] text-primary">
            ${deposit.toFixed(2)}
          </h5>
        </div>
      </div>
    </div>
  );
});
EarnInfoBlock.displayName = 'EarnInfoBlock';
