import { useQuery } from '@tanstack/react-query';
import { formatUnits, getAddress, getContract } from 'viem';
import { type PublicClient } from 'wagmi';

import { earnAbi } from '@/abi/earn/EarnAbi';
import { type CubeWithApyAndTvl } from '@/actions/get-all-cubes';

export const getEarnFeesKey = (cubeId: string) => `earn-fees-${cubeId}`;

export const useEarnFees = (
  cube: CubeWithApyAndTvl,
  publicClient: PublicClient,
) => {
  const earnContract = getContract({
    abi: earnAbi,
    address: getAddress(cube.earn),
    publicClient,
  });

  return useQuery({
    queryKey: [getEarnFeesKey(cube.id)],
    queryFn: async () => {
      const [depositFee, withdrawFee] = await earnContract.read.fees();
      // Fees are stored in wei (18 decimals), convert to percentage
      // Example: 2000000000000000 wei = 0.002 = 0.2%
      const depositFeePercent = Number(formatUnits(depositFee, 18));
      const withdrawFeePercent = Number(formatUnits(withdrawFee, 18));
      return {
        depositFee: depositFeePercent,
        withdrawFee: withdrawFeePercent,
      };
    },
  });
};
