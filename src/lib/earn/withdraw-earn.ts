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
  const [percents, price, { result: stableExpected }, [, reserved]] =
    await Promise.all([
      earn.read.PERCENTS_100(),
      priceAggregator.read.getPrice([getAddress(cube.stableAddress)]),
      earnPoolChecker.simulate.getWithdrawAmountOut([
        getAddress(cube.earn),
        userAddress,
        withdrawCost,
        BigInt(0),
      ]),
      earn.read.positions([userAddress]),
    ]);
  const costAfterWithdraw = positionCost - withdrawUsd;

  const stopLossCost =
    ((costAfterWithdraw -
      (reserved * price) / BigInt(10 ** cube.stableDecimals)) *
      BigInt(stopLossPercents)) /
    BigInt(100);

  const stable = await earn.read.stable();
  const stableWithoutReserved = stableExpected - reserved;
  const stableExpectedWithSlippage =
    stableWithoutReserved - (stableWithoutReserved * slippage) / percents;
  const oneInchSwap =
    stable !== tokenTo
      ? await oneInchEstimate({
          src: stable,
          dst: tokenTo,
          amount: stableExpectedWithSlippage,
          from: cube.earn,
          receiver: cube.earn,
          network: cube.network,
          disableEstimate: true,
          slippage: parseFloat(formatUnits(slippage, 18)),
        })
      : undefined;

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
