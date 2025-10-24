import {
  type Address,
  getAddress,
  getContract,
  type Hex,
  decodeAbiParameters,
} from 'viem';

import { iUniswapV2Router02Abi } from '@/abi/IUniswapV2Router02';
import { type CubeWithApyAndTvl } from '@/actions/get-all-cubes';
import { type MinAmountsOut } from '@/lib/earn/estimate-min-amounts-out';
import { type AppPublicClient } from '@/lib/viem-clients';

export type AmountsOut = {
  tokenSwapTo: Address;
  tokenSwapFrom: Address;
  swapPath: Hex;
  amountFrom: bigint;
}[][];

export const uniswapv2AmountsOut = async ({
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
  const minAmountsOut: MinAmountsOut = [];
  const uniswapV2Router = getContract({
    abi: iUniswapV2Router02Abi,
    address: getAddress(cube.uniswapV3Quoter),
    publicClient: provider,
  });

  for (let i = 0; i < amountsOut.length; ++i) {
    for (let j = 0; j < amountsOut[i].length; ++j) {
      if (!Array.isArray(minAmountsOut[i])) {
        minAmountsOut[i] = [];
      }

      if (
        getAddress(amountsOut[i][j].tokenSwapFrom) ===
        getAddress(cube.stableAddress)
      ) {
        minAmountsOut[i][j] = BigInt(0);
        continue;
      }
      const [decoded] = decodeAbiParameters(
        [{ type: 'address[]' }],
        amountsOut[i][j].swapPath as Hex,
      );
      const results = await uniswapV2Router.read.getAmountsOut([
        amountsOut[i][j].amountFrom,
        decoded,
      ]);
      if (results.length > 0) {
        const result = results[results.length - 1];
        minAmountsOut[i][j] = result - (result * slippage) / percents;
      }
    }
  }

  return minAmountsOut;
};
