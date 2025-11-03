import {
  type Address,
  encodeAbiParameters,
  formatUnits,
  getAddress,
  getContract,
  type Hex,
} from 'viem';

import { strategyRetroGammaAbi } from '@/abi/StrategyRetroGamma';
import { type VaultWithApyAndTvl } from '@/actions/get-all-vaults-with-apy-and-tvl';
import { type OneInchSwapEstimateResponse } from '@/actions/zaps/one-inch-estimate';
import { encodeBalancerZapData } from '@/lib/zaps/strats-balancer/common';
import {
  type GetOutZapsDataParamsStrat,
  type GetZapsDataParamsStrat,
  type ZapsData,
} from '@/lib/zaps/types';
import {
  encodeZapData,
  encodeZapOutData,
  estimateZapOutTokens,
  oneInchEstimateSwap,
} from '@/lib/zaps/utils';

const paramsStructData = [
  {
    name: 'params',
    type: 'tuple',
    components: [
      {
        name: 'inputToken',
        type: 'bytes',
      },
    ],
  },
] as const;

const paramsStructOutData = [
  {
    name: 'params',
    type: 'tuple',
    components: [
      {
        name: 'inputToken0',
        type: 'bytes',
      },
      {
        name: 'inputToken1',
        type: 'bytes',
      },
    ],
  },
] as const;

export const getZapsDataForRetroGamma = async (
  params: GetZapsDataParamsStrat,
): Promise<ZapsData> => {
  const { isTokenNative, token, tokenAmount, vault, provider, zapConfig } =
    params;

  if (vault.zapId === undefined) throw new Error('Unknown zapId');

  const strategyContract = getContract({
    abi: strategyRetroGammaAbi,
    address: getAddress(vault.strategy),
    publicClient: provider,
  });

  const tokenDst = await strategyContract.read.native();

  const estimate =
    token !== tokenDst
      ? await oneInchEstimateSwap({
          amount: tokenAmount.valueOf(),
          dst: tokenDst,
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

export const getZapsDataOutForRetroGamma = async (
  params: GetOutZapsDataParamsStrat,
) => {
  const { token, tokenAmount, vault, zapConfig } = params;

  if (vault.zapId === undefined) {
    throw new Error('unknown zap id');
  }

  const swapsArr: OneInchSwapEstimateResponse[] = [];

  const mockedEncodedData = encodeAbiParameters(paramsStructOutData, [
    {
      inputToken0: '0x',
      inputToken1: '0x',
    },
  ]);

  const tokensOutAmount = await estimateZapOutTokens(params, mockedEncodedData);

  const estimate1 =
    token !== tokensOutAmount?.result[0][0]
      ? await oneInchEstimateSwap({
          dst: token,
          src: tokensOutAmount?.result[0][0],
          amount: tokensOutAmount?.result[1][0],
          params,
        })
      : undefined;

  const estimate2 =
    token !== tokensOutAmount?.result[0][1]
      ? await oneInchEstimateSwap({
          dst: token,
          src: tokensOutAmount?.result[0][1],
          amount: tokensOutAmount?.result[1][1],
          params,
        })
      : undefined;

  if (estimate1) {
    swapsArr.push(estimate1);
  }

  if (estimate2) {
    swapsArr.push(estimate2);
  }

  const zapCalldata = encodeRetroGammaZapDataOut({
    token,
    tokenAmount,
    vault,
    inputToken0: (estimate1?.tx?.data ?? '0x') as Hex,
    inputToken1: (estimate2?.tx?.data ?? '0x') as Hex,
  });

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

export const encodeRetroGammaZapData = async ({
  isTokenNative,
  token,
  tokenAmount,
  vault,
  swapData,
}: {
  token: Address;
  tokenAmount: bigint;
  isTokenNative: boolean;
  vault: VaultWithApyAndTvl;
  swapData: Hex;
}) => {
  const params = encodeAbiParameters(paramsStructData, [
    {
      inputToken: swapData,
    },
  ]);

  return encodeZapData({
    isTokenNative,
    token,
    tokenAmount,
    vault,
    wantType: 0,
    params,
  });
};

export const encodeRetroGammaZapDataOut = ({
  inputToken0,
  inputToken1,
  token,
  tokenAmount,
  vault,
}: {
  token: Address;
  tokenAmount: bigint;
  vault: VaultWithApyAndTvl;
  inputToken0: Hex;
  inputToken1: Hex;
}) => {
  const params = encodeAbiParameters(paramsStructOutData, [
    {
      inputToken0,
      inputToken1,
    },
  ]);

  return encodeZapOutData({
    token,
    tokenAmount,
    vault,
    wantType: 0,
    params,
  });
};
