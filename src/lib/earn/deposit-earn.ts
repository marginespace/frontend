import {
  type Address,
  encodeFunctionData,
  type Hex,
  parseUnits,
  formatUnits,
} from 'viem';

import { earnAbi } from '@/abi/earn/EarnAbi';
import { type CubeWithApyAndTvl } from '@/actions/get-all-cubes';
import { oneInchEstimate } from '@/actions/zaps/one-inch-estimate';
import {
  estimateMinAmountsOut,
  type MinAmountsOut,
} from '@/lib/earn/estimate-min-amounts-out';
import { type AppPublicClient } from '@/lib/viem-clients';

export type DepositEarnParams = {
  cube: CubeWithApyAndTvl;
  provider: AppPublicClient;
  tokenInAmount: bigint;
  tokenIn: Address;
  tokenTo: Address;
  slippage: bigint;
  stopLossCostPercents: number;
  userAddress: Address;
  positionCost: bigint;
  depositETH?: boolean;
};

export const depositEarn = async ({
  cube,
  provider,
  tokenInAmount,
  tokenIn,
  tokenTo,
  slippage,
  stopLossCostPercents,
  userAddress,
  positionCost,
  depositETH = false,
}: DepositEarnParams) => {
  let oneInchSwap: Awaited<ReturnType<typeof oneInchEstimate>> | undefined;
  
  if (tokenIn !== tokenTo) {
    try {
      oneInchSwap = await oneInchEstimate({
          src: tokenIn,
          dst: tokenTo,
          amount: tokenInAmount,
          from: cube.earn,
          receiver: cube.earn,
          network: cube.network,
          disableEstimate: true,
          slippage: parseFloat(formatUnits(slippage, 18)),
      });
    } catch (error) {
      console.error('[depositEarn] 1inch API error:', error);
      // Если 1inch API недоступен (например, из-за лимитов бесплатного тарифа),
      // продолжаем без swap, но это может быть проблемой
      // В этом случае пользователь должен использовать стабильную монету напрямую
      throw new Error('1inch API is unavailable. Please try using the stable token directly or try again later.');
    }
  }

  const amountIn = BigInt(oneInchSwap?.toTokenAmount ?? tokenInAmount);

  const { minAmountsOut, stopLossCost } = await estimateMinAmountsOut({
    cube,
    provider,
    amountIn,
    slippage,
    stopLossCostPercents,
    userAddress,
    positionCost,
  });

  const { calldata, value } = encodeEarnDepositData({
    amountTokenIn: tokenInAmount,
    minAmountsOut,
    tokenIn,
    oneInchSwapData: (oneInchSwap?.tx.data as Hex) ?? '0x',
    stopLossCost,
    stopLossPercent: parseUnits(stopLossCostPercents.toString(), 18),
    depositETH,
  });

  return {
    oneInchSwap,
    minAmountsOut,
    calldata,
    value,
  };
};

export const encodeEarnDepositData = ({
  amountTokenIn,
  stopLossCost,
  tokenIn,
  oneInchSwapData,
  minAmountsOut,
  stopLossPercent,
  depositETH,
}: {
  amountTokenIn: bigint;
  stopLossCost: bigint;
  tokenIn: Address;
  oneInchSwapData: Hex;
  minAmountsOut: MinAmountsOut;
  stopLossPercent: bigint;
  depositETH: boolean;
}) => {
  const sharedParams = {
    stopLossCost,
    oneInchSwapData,
    stopLossPercent,
  };

  if (depositETH) {
    return {
      calldata: encodeFunctionData({
        abi: earnAbi,
        args: [
          {
            ...sharedParams,
          },
          minAmountsOut,
        ],
        functionName: 'depositETH',
      }),
      value: amountTokenIn,
    };
  } else {
    return {
      calldata: encodeFunctionData({
        abi: earnAbi,
        args: [
          {
            ...sharedParams,
            amountTokenIn,
            tokenIn,
          },
          minAmountsOut,
        ],
        functionName: 'deposit',
      }),
      value: BigInt(0),
    };
  }
};
