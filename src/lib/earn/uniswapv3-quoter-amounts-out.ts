import { type Address, getAddress, getContract } from 'viem';

import { uniswapV3QuoterAbi } from '@/abi/UniswapV3QuoterAbi';
import { type CubeWithApyAndTvl } from '@/actions/get-all-cubes';
import { type MinAmountsOut } from '@/lib/earn/estimate-min-amounts-out';
import { type AppPublicClient } from '@/lib/viem-clients';

export type AmountsOut = {
  tokenSwapTo: Address;
  tokenSwapFrom: Address;
  swapPath: Address;
  amountFrom: bigint;
}[][];

export const uniswapv3QuoterAmountsOut = async ({
  cube,
  provider,
  amountsOut,
  slippage,
  percents,
}: {
  cube: CubeWithApyAndTvl;
  provider: AppPublicClient;
  amountsOut: AmountsOut;
  slippage: bigint;
  percents: bigint;
}): Promise<bigint[][]> => {
  const minAmountsOut: MinAmountsOut = [[]];
  const uniswapV3QuoterContract = getContract({
    abi: uniswapV3QuoterAbi,
    address: getAddress(cube.uniswapV3Quoter),
    publicClient: provider,
  });

  for (let i = 0; i < amountsOut.length; i++) {
    for (let j = 0; j < amountsOut[i].length; j++) {
      if (!Array.isArray(minAmountsOut[i])) {
        minAmountsOut[i] = [];
      }
      if (
        getAddress(amountsOut[i][j].tokenSwapTo) ===
        getAddress(cube.stableAddress)
      ) {
        minAmountsOut[i][j] = BigInt(0);
        continue;
      }
      const { result } = await uniswapV3QuoterContract.simulate.quoteExactInput(
        [amountsOut[i][j].swapPath, amountsOut[i][j].amountFrom],
      );

      minAmountsOut[i][j] = result - (result * slippage) / percents;
    }
  }

  return minAmountsOut;
};
