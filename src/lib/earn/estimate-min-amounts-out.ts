import { type Address, getAddress, getContract } from 'viem';

import { earnAbi } from '@/abi/earn/EarnAbi';
import { earnConfigurationAbi } from '@/abi/earn/EarnConfigurationAbi';
import { earnHelperAbi } from '@/abi/earn/EarnHelperAbi';
import { priceAggregatorAbi } from '@/abi/earn/PriceAggregatorAbi';
import { type CubeWithApyAndTvl } from '@/actions/get-all-cubes';
import { uniswapv2AmountsOut } from '@/lib/earn/uniswapv2-amounts-out';
import {
  type AmountsOut,
  uniswapv3QuoterAmountsOut,
} from '@/lib/earn/uniswapv3-quoter-amounts-out';
import { type AppPublicClient } from '@/lib/viem-clients';

export type EstimateMinAmountsOutParams = {
  cube: CubeWithApyAndTvl;
  provider: AppPublicClient;
  userAddress: Address;
  amountIn: bigint;
  positionCost: bigint;
  stopLossCostPercents: number;
  slippage: bigint;
};

export type MinAmountsOut = bigint[][];

export const estimateMinAmountsOut = async ({
  cube,
  provider,
  amountIn,
  positionCost,
  userAddress,
  stopLossCostPercents,
  slippage,
}: EstimateMinAmountsOutParams) => {
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
  const earnConfiguration = getContract({
    abi: earnConfigurationAbi,
    address: getAddress(cube.earnConfiguration),
    publicClient: provider,
  });
  const priceAggregator = getContract({
    abi: priceAggregatorAbi,
    address: getAddress(cube.priceAggregator),
    publicClient: provider,
  });

  const [[, reserved], [feePercent], percents, price] = await Promise.all([
    earn.read.positions([userAddress]),
    earn.read.fees(),
    earn.read.PERCENTS_100(),
    priceAggregator.read.getPrice([getAddress(cube.stableAddress)]),
  ]);

  let amountInStable = amountIn - (amountIn * feePercent) / percents;

  if (stopLossCostPercents !== 0 && reserved === BigInt(0)) {
    const toReserveForAutomation =
      await earnConfiguration.read.toReserveForAutomation();
    amountInStable -= toReserveForAutomation;
  } else if (stopLossCostPercents === 0 && reserved !== BigInt(0)) {
    amountInStable += reserved;
  }

  const totalPositionValue =
    (amountInStable * price) / BigInt(10 ** cube.stableDecimals) + positionCost;
  
  // Ensure stopLossCost is never negative
  const calculatedStopLossCost =
    (totalPositionValue * BigInt(stopLossCostPercents)) / BigInt(100);
  
  const stopLossCost =
    calculatedStopLossCost < BigInt(0) ? BigInt(0) : calculatedStopLossCost;

  const amountsOut = (await earnHelperContract.read.estimateAmountsOutDeposit([
    earn.address,
    amountInStable,
  ])) as AmountsOut;

  const minAmountsOut =
    cube.network === 'avax' || cube.network === 'base'
      ? await uniswapv2AmountsOut({
          amountsOut,
          cube,
          provider,
          percents,
          slippage,
        })
      : await uniswapv3QuoterAmountsOut({
          amountsOut,
          cube,
          provider,
          percents,
          slippage,
        });

  return {
    minAmountsOut,
    earn,
    earnConfiguration,
    earnHelperContract,
    stopLossCost,
  };
};
