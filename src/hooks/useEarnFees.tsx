import { useQuery } from '@tanstack/react-query';
import { getAddress, getContract } from 'viem';
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
      return {
        depositFee: Number(depositFee) / 100,
        withdrawFee: Number(withdrawFee) / 100,
      };
    },
  });
};
