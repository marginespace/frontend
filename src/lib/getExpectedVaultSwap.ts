import { type Address, formatUnits, getAddress, getContract } from 'viem';

import { type AppPublicClient } from './viem-clients';

import { earnConfigurationAbi } from '@/abi/earn/EarnConfigurationAbi';
import { getChainConfig } from '@/actions/get-chain-config';
import {
  uniswapv2AmountOut,
  uniswapv2AmountOutBase,
  uniswapv3AmountOut,
} from '@/lib/earn/getExpectedSwap';

export const getExpectedVaultSwap = async ({
  chain,
  provider,
  tokenIn,
  tokenOut,
  amountIn,
  nativeDecimals,
}: {
  chain: string;
  provider: AppPublicClient;
  tokenIn: Address;
  tokenOut: Address;
  amountIn: bigint;
  nativeDecimals: number;
}) => {
  if (amountIn === BigInt(0)) return '0.00';

  const config = (await getChainConfig())[chain];

  const earnConfigContract = getContract({
    abi: earnConfigurationAbi,
    address: getAddress(config.earnConfiguration),
    publicClient: provider,
  });

  try {
    const swapPath = await earnConfigContract.read.swapPathes([
      tokenIn,
      tokenOut,
    ]);

    const quoter = getAddress(config.uniswapV3Quoter);

    const amountOutWei =
      chain === 'avax' || chain === 'base'
        ? chain === 'base'
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
