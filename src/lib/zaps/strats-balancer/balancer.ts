import {
  type Address,
  encodeAbiParameters,
  formatUnits,
  getAddress,
  getContract,
  type Hex,
  zeroAddress,
} from 'viem';

import { balancerVaultAbi } from '@/abi/BalancerVault';
import { composableStablePoolAbi } from '@/abi/ComposableStablePool';
import { strategyAuraBalancerMultiRewardGaugeUniV3Abi } from '@/abi/StrategyAuraBalancerMultiRewardGaugeUniV3';
import { strategyAuraGyroMainnetAbi } from '@/abi/StrategyAuraGyroMainnet';
import { strategyAuraMainnetAbi } from '@/abi/StrategyAuraMainnet';
import { ZapCategory } from '@/actions/zaps/get-all-zap-configs';
import { type OneInchSwapEstimateResponse } from '@/actions/zaps/one-inch-estimate';
import {
  auraParamsOutStructData,
  encodeBalancerZapData,
  encodeBalancerZapOutDataAura,
  encodeBalancerZapOutDataGyro,
  ZapTypeBalancer,
} from '@/lib/zaps/strats-balancer/common';
import {
  type GetOutZapsDataParamsStrat,
  type GetZapsDataParamsStrat,
  type ZapsData,
} from '@/lib/zaps/types';
import { estimateZapOutTokens, oneInchEstimateSwap } from '@/lib/zaps/utils';

export const getZapsDataForBalancer = async (
  params: GetZapsDataParamsStrat,
): Promise<ZapsData> => {
  const { isTokenNative, token, tokenAmount, vault, provider, zapConfig } =
    params;

  if (vault.zapId === undefined) {
    throw new Error('unkown zap id');
  }

  let tokenDst: Address;

  if (vault.zapId !== ZapTypeBalancer.WANT_TYPE_BALANCER_AURA_GYRO) {
    const strategyContract = getContract({
      abi:
        vault.zapId === ZapTypeBalancer.WANT_TYPE_BALANCER_AURA
          ? strategyAuraMainnetAbi
          : strategyAuraBalancerMultiRewardGaugeUniV3Abi,
      address: getAddress(vault.strategy),
      publicClient: provider,
    });

    tokenDst = (
      vault.zapCategory === ZapCategory.BALANCER_AURA_ETH
        ? await strategyContract.read.getNative()
        : await strategyContract.read.native()
    ) as Address;
  } else {
    const strategyContract = getContract({
      abi: strategyAuraGyroMainnetAbi,
      address: getAddress(vault.strategy),
      publicClient: provider,
    });

    tokenDst = await strategyContract.read.getNative();
  }

  const estimate =
    getAddress(tokenDst) !== getAddress(token)
      ? await oneInchEstimateSwap({
          amount: tokenAmount.valueOf(),
          dst: tokenDst ?? zeroAddress,
          params,
        })
      : undefined;

  const zapCalldata = encodeBalancerZapData({
    isTokenNative,
    swapData: (estimate?.tx?.data ?? '0x') as Hex,
    token,
    tokenAmount: tokenAmount.valueOf(),
    vault,
    wantType: vault.zapId,
  });

  return {
    swaps: estimate
      ? [
          {
            from: {
              token: getAddress(estimate.fromToken.address),
              tokenName: estimate.fromToken.symbol,
              amount: +formatUnits(
                BigInt(estimate.fromTokenAmount),
                estimate.fromToken.decimals,
              ),
            },
            to: {
              token: getAddress(estimate.toToken.address),
              tokenName: estimate.toToken.symbol,
              amount: +formatUnits(
                BigInt(estimate.toTokenAmount),
                estimate.toToken.decimals,
              ),
            },
            estimate: estimate,
          },
        ]
      : [],
    zapCalldata: {
      to: getAddress(zapConfig.zapAddress),
      calldata: zapCalldata,
      value: isTokenNative ? tokenAmount.valueOf() : undefined,
    },
    deposit: {
      estimatedAmount: +formatUnits(
        BigInt(estimate?.toTokenAmount ?? tokenAmount),
        estimate?.toToken?.decimals ?? 18,
      ),
      depositTokenName: vault.token,
    },
  };
};

export const getZapsDataOutForBalancer = async (
  params: GetOutZapsDataParamsStrat,
) => {
  const { token, tokenAmount, vault, provider, zapConfig } = params;

  if (vault.zapId === undefined) {
    throw new Error('unknown zap id');
  }

  const swapsArr: OneInchSwapEstimateResponse[] = [];
  let zapCalldata: Hex;

  if (vault.zapId !== ZapTypeBalancer.WANT_TYPE_BALANCER_AURA_GYRO) {
    const strategyContract = getContract({
      abi: strategyAuraMainnetAbi,
      address: getAddress(vault.strategy),
      publicClient: provider,
    });

    const wantAddress = await strategyContract.read.want();

    const want = getContract({
      abi: composableStablePoolAbi,
      address: wantAddress,
      publicClient: provider,
    });

    const poolId = await want.read.getPoolId();

    const balancerVaultAddress = await strategyContract.read.unirouter();

    const balancerVault = getContract({
      abi: balancerVaultAbi,
      address: balancerVaultAddress,
      publicClient: provider,
    });

    const tokens = await balancerVault.read.getPoolTokens([poolId]);

    let tokenIndexRoute: number;
    let tokenOut: Address;

    if (vault.zapId === ZapTypeBalancer.WANT_TYPE_BALANCER_AURA) {
      tokenIndexRoute = 1;
      tokenOut = tokens[0][tokenIndexRoute + 1];
    } else {
      tokenIndexRoute = 0;
      tokenOut = tokens[0][tokenIndexRoute];
    }

    const mockedEncodedData = encodeAbiParameters(auraParamsOutStructData, [
      {
        tokenOut,
        tokenIndexRoute,
        inputToken: '0x',
      },
    ]);

    const tokenOutAmount = await estimateZapOutTokens(
      params,
      mockedEncodedData,
    );

    const estimate =
      token !== tokenOut
        ? await oneInchEstimateSwap({
            dst: token,
            src: tokenOut,
            amount:
              vault.zapId === ZapTypeBalancer.WANT_TYPE_BALANCER_AURA
                ? tokenOutAmount.result[1][tokenIndexRoute + 1]
                : tokenOutAmount.result[1][tokenIndexRoute],
            params,
          })
        : undefined;

    zapCalldata = encodeBalancerZapOutDataAura({
      tokenOutIndex: tokenIndexRoute,
      swapData: (estimate?.tx?.data ?? '0x') as Hex,
      token,
      tokenOut,
      tokenAmount,
      vault,
      wantType: vault.zapId,
    });

    if (estimate) {
      swapsArr.push(estimate);
    }
  } else {
    const tokensOutWithAmounts = await estimateZapOutTokens(params);

    const estimate1 =
      token !== tokensOutWithAmounts.result[0][0]
        ? await oneInchEstimateSwap({
            dst: token,
            src: tokensOutWithAmounts.result[0][0],
            amount: tokensOutWithAmounts.result[1][0],
            params,
          })
        : undefined;

    const estimate2 =
      token !== tokensOutWithAmounts.result[0][1]
        ? await oneInchEstimateSwap({
            dst: token,
            src: tokensOutWithAmounts.result[0][1],
            amount: tokensOutWithAmounts.result[1][1],
            params,
          })
        : undefined;

    zapCalldata = encodeBalancerZapOutDataGyro({
      token,
      tokenAmount,
      vault,
      wantType: vault.zapId,
      token0: (estimate1?.tx?.data ?? '0x') as Hex,
      token1: (estimate2?.tx?.data ?? '0x') as Hex,
    });

    if (estimate1) {
      swapsArr.push(estimate1);
    }

    if (estimate2) {
      swapsArr.push(estimate2);
    }
  }

  return {
    swaps: swapsArr.map((v) => ({
      from: {
        token: getAddress(v.fromToken.address),
        tokenName: v.fromToken.symbol,
        amount: +formatUnits(BigInt(v.fromTokenAmount), v.fromToken.decimals),
      },
      to: {
        token: getAddress(v.toToken.address),
        tokenName: v.toToken.symbol,
        amount: +formatUnits(BigInt(v.toTokenAmount), v.toToken.decimals),
      },
      estimate: v,
    })),
    zapCalldata: {
      to: getAddress(zapConfig.zapAddress),
      calldata: zapCalldata,
    },
    withdraw: {
      estimatedAmount:
        swapsArr.length > 1
          ? +formatUnits(
              BigInt(swapsArr?.[0]?.toTokenAmount ?? '0') +
                BigInt(swapsArr?.[1]?.toTokenAmount ?? '0'),
              18,
            )
          : +formatUnits(BigInt(swapsArr?.[0]?.toTokenAmount ?? '0'), 18),
      withdrawTokenName: vault.token,
    },
  };
};
