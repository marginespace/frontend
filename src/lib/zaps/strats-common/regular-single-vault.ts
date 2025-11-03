import {
  type Hex,
  formatUnits,
  getAddress,
  zeroAddress,
  getContract,
} from 'viem';

import {
  ZapTypeCommon,
  encodeCommonZapData,
  encodeCommonZapOutData,
} from './common';

import {
  type GetOutZapsDataParamsStrat,
  type GetZapsDataParamsStrat,
  type ZapsData,
  type ZapsOutData,
} from '../types';
import { estimateZapOutTokens, oneInchEstimateSwap } from '../utils';

import { stargateStrategy } from '@/abi/StargateStrategy';
import { type OneInchSwapEstimateResponse } from '@/actions/zaps/one-inch-estimate';

export const getZapsDataForRegularSingleVaultType = async (
  params: GetZapsDataParamsStrat,
): Promise<ZapsData> => {
  const { isTokenNative, token, tokenAmount, vault, provider, zapConfig } =
    params;

  if (vault.zapId === undefined) throw new Error('Unknown zapId');

  const wantType = vault.zapId as ZapTypeCommon;

  let tokenDst = vault.tokenAddress ?? zeroAddress;

  if (vault.zapId === ZapTypeCommon.STARGATE) {
    const stratContract = getContract({
      abi: stargateStrategy,
      address: getAddress(vault.strategy),
      publicClient: provider,
    });

    tokenDst = await stratContract.read.depositToken();
  }

  const estimate =
    getAddress(tokenDst) !== getAddress(token)
      ? await oneInchEstimateSwap({
          params,
          dst: tokenDst,
        })
      : undefined;

  const zapCalldata = encodeCommonZapData({
    isTokenNative,
    swapData1: (estimate?.tx?.data ?? '0x') as Hex,
    swapData2: '0x',
    token,
    tokenAmount: tokenAmount.valueOf(),
    vault,
    wantType: wantType,
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

export const getZapsOutDataForRegularSingleVaultType = async (
  params: GetOutZapsDataParamsStrat,
): Promise<ZapsOutData> => {
  const { token, tokenAmount, vault, zapConfig } = params;

  if (!vault.tokenAddress) throw new Error('Unknown vault token');
  if (vault.zapId === undefined) throw new Error('Unknown zapId');

  const wantType = vault.zapId as ZapTypeCommon;

  const tokenOutAmount = await estimateZapOutTokens(params);

  const src0 = tokenOutAmount.result[0][0];
  const dst = token;

  const outAmount0 = tokenOutAmount.result[1][0];
  let outAmount1 = BigInt(0);

  const estimate =
    src0 !== dst
      ? await oneInchEstimateSwap({
          dst: token,
          src: src0,
          amount: tokenOutAmount.result[1][0],
          params,
        })
      : undefined;

  let estimate2: OneInchSwapEstimateResponse | undefined;

  if (
    wantType === ZapTypeCommon.SINGLE_GOV &&
    tokenOutAmount.result[1][1] !== BigInt(0)
  ) {
    const src1 = tokenOutAmount.result[0][1];

    outAmount1 = tokenOutAmount.result[1][1];

    estimate2 =
      src1 !== dst
        ? await oneInchEstimateSwap({
            dst,
            src: src1,
            amount: tokenOutAmount.result[1][1],
            params,
          })
        : undefined;
  }

  const zapCalldata = encodeCommonZapOutData({
    swapData1: (estimate?.tx?.data ?? '0x') as Hex,
    swapData2: (estimate2?.tx?.data ?? '0x') as Hex,
    token,
    tokenAmount: tokenAmount.valueOf(),
    vault,
    wantType: wantType,
  });

  return {
    swaps: [
      ...(estimate
        ? [
            {
              from: {
                token: getAddress(estimate.fromToken.address),
                tokenName: estimate.fromToken.name,
                amount: +formatUnits(
                  BigInt(estimate.fromTokenAmount),
                  estimate.fromToken.decimals,
                ),
              },
              to: {
                token: getAddress(estimate.toToken.address),
                tokenName: estimate.toToken.name,
                amount: +formatUnits(
                  BigInt(estimate.toTokenAmount),
                  estimate.toToken.decimals,
                ),
              },
              estimate: estimate,
            },
          ]
        : []),
      ...(estimate2
        ? [
            {
              estimate: estimate2,
              from: {
                token: getAddress(estimate2.fromToken.address),
                tokenName: estimate2.fromToken.name,
                amount: +formatUnits(
                  BigInt(estimate2.fromTokenAmount),
                  estimate2.fromToken.decimals,
                ),
              },
              to: {
                token: getAddress(estimate2.toToken.address),
                tokenName: estimate2.toToken.name,
                amount: +formatUnits(
                  BigInt(estimate2.toTokenAmount),
                  estimate2.toToken.decimals,
                ),
              },
            },
          ]
        : []),
    ],
    zapCalldata: {
      to: getAddress(zapConfig.zapAddress),
      calldata: zapCalldata,
    },
    withdraw: {
      estimatedAmount: +formatUnits(
        estimate || estimate2
          ? BigInt(estimate?.toTokenAmount ?? 0) +
              BigInt(estimate2?.toTokenAmount ?? 0)
          : outAmount0 + outAmount1,
        params.tokenMetadata.decimals,
      ),
      withdrawTokenName: params.tokenMetadata.symbol,
    },
  };
};
