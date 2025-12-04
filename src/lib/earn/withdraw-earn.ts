import {
  type Address,
  encodeFunctionData,
  formatUnits,
  getAddress,
  getContract,
  type Hex,
} from 'viem';

import { earnAbi } from '@/abi/earn/EarnAbi';
import { earnPoolCheckerAbi } from '@/abi/earn/EarnPoolChecker';
import { priceAggregatorAbi } from '@/abi/earn/PriceAggregatorAbi';
import { type CubeWithApyAndTvl } from '@/actions/get-all-cubes';
import { oneInchEstimate } from '@/actions/zaps/one-inch-estimate';
import { type AppPublicClient } from '@/lib/viem-clients';

export const withdrawEarn = async ({
  cube,
  provider,
  withdrawCost,
  tokenTo,
  userAddress,
  stopLossCostPercent,
  withdrawUsd,
  slippage,
  positionCost,
  unwrapNative,
}: {
  cube: CubeWithApyAndTvl;
  provider: AppPublicClient;
  withdrawCost: bigint;
  withdrawUsd: bigint;
  tokenTo: Address;
  userAddress: Address;
  stopLossCostPercent: bigint;
  slippage: bigint;
  positionCost: bigint;
  unwrapNative: boolean;
}) => {
  const stopLossPercents = +formatUnits(stopLossCostPercent, 18);
  const earnPoolChecker = getContract({
    abi: earnPoolCheckerAbi,
    address: getAddress(cube.gelatoChecker),
    publicClient: provider,
  });
  const earn = getContract({
    abi: earnAbi,
    address: getAddress(cube.earn),
    publicClient: provider,
  });
  const priceAggregator = getContract({
    abi: priceAggregatorAbi,
    address: getAddress(cube.priceAggregator),
    publicClient: provider,
  });
  
  // First, get position data to calculate stopLossCost
  const [percents, price, position] = await Promise.all([
    earn.read.PERCENTS_100(),
    priceAggregator.read.getPrice([getAddress(cube.stableAddress)]),
    earn.read.positions([userAddress]),
  ]);
  
  // Extract position fields: [automationTaskId, reservedForAutomation, size, stopLossCost, stopLossPercent]
  const reserved = position[1];
  const positionSize = position[2];
  
  // Validate position and withdrawCost
  if (positionSize === BigInt(0)) {
    throw new Error('No position found for this user');
  }
  if (withdrawCost > positionSize) {
    throw new Error('Withdraw amount exceeds position size');
  }
  if (withdrawCost === BigInt(0)) {
    throw new Error('Withdraw amount must be greater than 0');
  }
  
  // Calculate approximate stopLossCost before calling getWithdrawAmountOut
  // This is needed because getWithdrawAmountOut requires the correct stopLossCost parameter
  const costAfterWithdraw = positionCost - withdrawUsd;
  const adjustedCost =
    costAfterWithdraw - (reserved * price) / BigInt(10 ** cube.stableDecimals);
  
  // Ensure stopLossCost is never negative
  const calculatedStopLossCost =
    (adjustedCost * BigInt(stopLossPercents)) / BigInt(100);
  
  const stopLossCost =
    calculatedStopLossCost < BigInt(0) ? BigInt(0) : calculatedStopLossCost;
  
  // Now call getWithdrawAmountOut with the calculated stopLossCost
  let stableExpected: bigint;
  try {
    const result = await earnPoolChecker.simulate.getWithdrawAmountOut([
      getAddress(cube.earn),
      userAddress,
      withdrawCost,
      stopLossCost,
    ]);
    stableExpected = result.result;
  } catch (error) {
    // If simulation fails, try with stopLossCost = 0 as fallback
    // This might happen if the calculated stopLossCost is incorrect or if withdrawCost is too small
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.warn('[withdrawEarn] getWithdrawAmountOut failed with calculated stopLossCost, trying with 0:', errorMessage);
    try {
      const result = await earnPoolChecker.simulate.getWithdrawAmountOut([
        getAddress(cube.earn),
        userAddress,
        withdrawCost,
        BigInt(0),
      ]);
      stableExpected = result.result;
    } catch (fallbackError) {
      const fallbackMessage = fallbackError instanceof Error ? fallbackError.message : String(fallbackError);
      throw new Error(`Failed to estimate withdrawal amount: ${fallbackMessage}. Please try a different withdrawal amount.`);
    }
  }

  const stable = await earn.read.stable();
  
  // Check if this is a full withdrawal or stop loss is being set to 0
  // In these cases, the contract will add back the reserved amount (see EarnPool.sol line 470)
  // The contract checks: size - params.withdrawCost == 0 (exact match)
  // We check the same condition, accounting for potential rounding by checking if difference is negligible
  const remainingAfterWithdraw = positionSize > withdrawCost ? positionSize - withdrawCost : BigInt(0);
  // Consider it a full withdrawal if remaining is 0 or very small (less than 1e12, accounting for rounding)
  const isFullWithdrawal = remainingAfterWithdraw === BigInt(0) || remainingAfterWithdraw < BigInt(10 ** 12);
  const isStopLossZero = stopLossCost === BigInt(0);
  const shouldReservedBeReturned = (isFullWithdrawal || isStopLossZero) && reserved > BigInt(0);
  
  // If reserved should be returned by the contract, don't subtract it from stableExpected
  // Otherwise, subtract it because it will remain reserved
  const stableWithoutReserved = shouldReservedBeReturned 
    ? stableExpected 
    : stableExpected - reserved;
  const stableExpectedWithSlippage =
    stableWithoutReserved - (stableWithoutReserved * slippage) / percents;
  
  let oneInchSwap: Awaited<ReturnType<typeof oneInchEstimate>> | undefined;
  
  if (stable !== tokenTo) {
    // Validate amount is positive
    if (stableExpectedWithSlippage <= BigInt(0)) {
      throw new Error('Withdrawal amount is too small or invalid');
    }
    
    try {
      oneInchSwap = await oneInchEstimate({
          src: stable,
          dst: tokenTo,
          amount: stableExpectedWithSlippage,
          from: cube.earn,
          receiver: cube.earn,
          network: cube.network,
          disableEstimate: true,
          slippage: parseFloat(formatUnits(slippage, 18)),
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      
      if (errorMessage.includes('insufficient liquidity')) {
        throw new Error('Insufficient liquidity for this swap. Please try withdrawing to stable token instead.');
      }
      
      throw new Error('1inch API is unavailable. Please try withdrawing to stable token or try again later.');
    }
  }

  const calldata = encodeEarnWithdrawData({
    withdrawCost,
    withdrawalToken: tokenTo,
    unwrapNative,
    minStableOut: stableExpectedWithSlippage,
    oneInchSwapData: (oneInchSwap?.tx.data as Hex) ?? '0x',
    stopLossCost,
  });

  return {
    oneInchSwap,
    calldata,
    minStableOutL: stableExpectedWithSlippage,
  };
};

export const encodeEarnWithdrawData = ({
  withdrawCost,
  stopLossCost,
  minStableOut,
  oneInchSwapData,
  unwrapNative,
  withdrawalToken,
}: {
  withdrawCost: bigint;
  stopLossCost: bigint;
  minStableOut: bigint;
  oneInchSwapData: Hex;
  unwrapNative: boolean;
  withdrawalToken: Address;
}) => {
  return encodeFunctionData({
    abi: earnAbi,
    args: [
      {
        withdrawCost,
        stopLossCost,
        unwrapNative,
        withdrawalToken,
        minStableOut,
        oneInchSwapData,
      },
    ],
    functionName: 'withdraw',
  });
};
