import { type Address, getAddress, getContract } from 'viem';

import { earnAbi } from '@/abi/earn/EarnAbi';
import { earnHelperAbi } from '@/abi/earn/EarnHelperAbi';
import { type CubeWithApyAndTvl } from '@/actions/get-all-cubes';
import { uniswapv2AmountsOut } from '@/lib/earn/uniswapv2-amounts-out';
import {
  type AmountsOut,
  uniswapv3QuoterAmountsOut,
} from '@/lib/earn/uniswapv3-quoter-amounts-out';
import { getStateDiffForMockedBalance } from '@/lib/mock-balance';
import {
  type AppPublicClient,
  simulateContractWithStateDiff,
} from '@/lib/viem-clients';

export type EstimateWithdrawMinAmountsOut = {
  cube: CubeWithApyAndTvl;
  provider: AppPublicClient;
  userAddress: Address;
  slippage: bigint;
  withdrawCost: bigint;
  tokensOut: Address[];
};

export const estimateWithdrawMinAmountsOut = async ({
  cube,
  provider,
  userAddress,
  tokensOut,
  slippage,
  withdrawCost,
}: EstimateWithdrawMinAmountsOut) => {
  const earnHelperContract = getContract({
    abi: earnHelperAbi,
    address: getAddress(cube.earnHelper),
    publicClient: provider,
  });
  const earn = getContract({
    abi: earnAbi,
    address: getAddress(cube.earn),
    publicClient: provider,
  });

  const percents = await earn.read.PERCENTS_100();

  const mockedState = getStateDiffForMockedBalance({
    user: userAddress,
    tokenAddresses: tokensOut,
  });

  const { result: amountsOut } = await simulateContractWithStateDiff(provider, {
    abi: earnHelperAbi,
    address: earnHelperContract.address,
    functionName: 'estimateAmountsOutWithdraw',
    stateDiff: mockedState,
    args: [earn.address, userAddress, withdrawCost],
  });

  const minAmountsOut =
    cube.network === 'avax'
      ? await uniswapv2AmountsOut({
          amountsOut: amountsOut as AmountsOut,
          cube,
          provider,
          percents,
          slippage,
        })
      : await uniswapv3QuoterAmountsOut({
          amountsOut: amountsOut as AmountsOut,
          cube,
          provider,
          percents,
          slippage,
        });

  return {
    minAmountsOut,
    earn,
    earnHelper: earnHelperContract,
  };
};
