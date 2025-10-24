import {
  type Address,
  decodeAbiParameters,
  formatUnits,
  getAddress,
  getContract,
  type Hex,
} from 'viem';

import { type AppPublicClient } from '../viem-clients';

import { aerodromeAbi } from '@/abi/AerodromeRouter';
import { earnConfigurationAbi } from '@/abi/earn/EarnConfigurationAbi';
import { iUniswapV2Router02Abi } from '@/abi/IUniswapV2Router02';
import { uniswapV3QuoterAbi } from '@/abi/UniswapV3QuoterAbi';
import { type CubeWithApyAndTvl } from '@/actions/get-all-cubes';

export const getExpectedSwap = async ({
  cube,
  provider,
  tokenIn,
  tokenOut,
  amountIn,
  nativeDecimals,
}: {
  cube: CubeWithApyAndTvl;
  provider: AppPublicClient;
  tokenIn: Address;
  tokenOut: Address;
  amountIn: bigint;
  nativeDecimals: number;
}) => {
  if (amountIn === BigInt(0)) return '0.00';

  const earnConfigContract = getContract({
    abi: earnConfigurationAbi,
    address: getAddress(cube.earnConfiguration),
    publicClient: provider,
  });

  try {
    const swapPath = await earnConfigContract.read.swapPathes([
      tokenIn,
      tokenOut,
    ]);

    const quoter = getAddress(cube.uniswapV3Quoter);

    const amountOutWei =
      cube.network === 'avax' || cube.network === 'base'
        ? cube.network === 'base'
          ? await uniswapv2AmountOutBase({
              quoter,
              provider,
              amountIn,
              swapPath,
            })
          : await uniswapv2AmountOut({
              quoter,
              provider,
              amountIn,
              swapPath,
            })
        : await uniswapv3AmountOut({
            quoter,
            provider,
            amountIn,
            swapPath,
          });

    const parsedResult = parseFloat(formatUnits(amountOutWei, nativeDecimals));

    const isSmall = String(parsedResult).startsWith('0.00');

    return parsedResult.toFixed(isSmall ? 4 : 2);
  } catch (error) {
    console.error('Error getting quote:', error);
  }
};

export const uniswapv2AmountOut = async ({
  swapPath,
  quoter,
  provider,
  amountIn,
}: {
  quoter: Address;
  swapPath: Hex;
  provider: AppPublicClient;
  amountIn: bigint;
}): Promise<bigint> => {
  const uniswapV2Router = getContract({
    abi: iUniswapV2Router02Abi,
    address: quoter,
    publicClient: provider,
  });
  const [decoded] = decodeAbiParameters([{ type: 'address[]' }], swapPath);
  const results = await uniswapV2Router.read.getAmountsOut([amountIn, decoded]);

  return results[results.length - 1];
};

export const uniswapv2AmountOutBase = async ({
  swapPath,
  quoter,
  provider,
  amountIn,
}: {
  quoter: Address;
  swapPath: Hex;
  provider: AppPublicClient;
  amountIn: bigint;
}): Promise<bigint> => {
  const uniswapV2Router = getContract({
    abi: aerodromeAbi,
    address: quoter,
    publicClient: provider,
  });
  const [decoded] = decodeAbiParameters(
    [
      {
        type: 'tuple[]',
        components: [
          { name: 'from', type: 'address' },
          { name: 'to', type: 'address' },
          { name: 'stable', type: 'bool' },
          { name: 'factory', type: 'address' },
        ],
      },
    ],
    swapPath,
  );

  const results = (await uniswapV2Router.read.getAmountsOut([
    amountIn,
    decoded.map((d) => {
      return {
        from: d.from,
        to: d.to,
        stable: d.stable,
        factory: d.factory,
      };
    }),
  ])) as bigint[];

  return results[results.length - 1];
};

export const uniswapv3AmountOut = async ({
  swapPath,
  quoter,
  provider,
  amountIn,
}: {
  quoter: Address;
  swapPath: Hex;
  provider: AppPublicClient;
  amountIn: bigint;
}): Promise<bigint> => {
  const uniswapV3QuoterContract = getContract({
    abi: uniswapV3QuoterAbi,
    address: quoter,
    publicClient: provider,
  });

  return (
    await uniswapV3QuoterContract.simulate.quoteExactInput([swapPath, amountIn])
  ).result;
};
