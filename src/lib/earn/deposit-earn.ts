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
  const oneInchSwap =
    tokenIn !== tokenTo
      ? await oneInchEstimate({
          src: tokenIn,
          dst: tokenTo,
          amount: tokenInAmount,
          from: cube.earn,
          receiver: cube.earn,
          network: cube.network,
          disableEstimate: true,
          slippage: parseFloat(formatUnits(slippage, 18)),
        })
      : undefined;

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
