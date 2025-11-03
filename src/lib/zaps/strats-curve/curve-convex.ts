import {
  type Hex,
  formatUnits,
  getAddress,
  getContract,
  zeroAddress,
  type Address,
  encodeAbiParameters,
} from 'viem';

import { ZapTypeCurve } from './common';

import {
  type ZapsData,
  type ZapsOutData,
  type GetOutZapsDataParamsStrat,
  type GetZapsDataParamsStrat,
} from '../types';
import {
  encodeZapData,
  encodeZapOutData,
  estimateZapOutTokens,
  oneInchEstimateSwap,
} from '../utils';

import { commonZapOneInchAbi } from '@/abi/CommonZapOneInch';
import { curveConvexWantToken } from '@/abi/CurveConvexWantToken';
import { strategyConvex } from '@/abi/StrategyConvex';
import { strategyCurveConvex } from '@/abi/StrategyCurveConvex';
import { type VaultWithApyAndTvl } from '@/actions/get-all-vaults-with-apy-and-tvl';

const paramsStructData = [
  {
    components: [
      {
        name: 'inputToken',
        type: 'bytes',
      },
    ],
    name: 'params',
    type: 'tuple',
  },
] as const;

const paramsStructDataConvexOut = paramsStructData;

const paramsStructDataCurveConvexOut = [
  {
    components: [
      {
        name: 'token',
        type: 'address',
      },
      {
        name: 'tokenIndex',
        type: 'uint256',
      },
      {
        name: 'inputToken',
        type: 'bytes',
      },
    ],
    name: 'params',
    type: 'tuple',
  },
] as const;

const encodeConvexZapData = ({
  isTokenNative,
  token,
  tokenAmount,
  vault,
  swapData,
  wantType,
}: {
  token: Address;
  tokenAmount: bigint;
  isTokenNative: boolean;
  vault: VaultWithApyAndTvl;
  swapData: Hex;
  wantType: ZapTypeCurve;
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
    wantType,
    params,
  });
};

const encodeCurveConvexZapOutData = ({
  params: { tokenAmount, vault },
  token,
  tokenOut,
  tokenIndex,
  swapData,
}: {
  params: GetOutZapsDataParamsStrat;
  token: Address;
  tokenIndex: bigint;
  tokenOut?: Address;
  swapData?: Hex;
}) => {
  const params = encodeAbiParameters(paramsStructDataCurveConvexOut, [
    {
      token,
      tokenIndex,
      inputToken: swapData ?? '0x',
    },
  ]);

  return {
    calldata: encodeZapOutData({
      token: tokenOut ?? token,
      tokenAmount,
      vault,
      wantType: vault.zapId as ZapTypeCurve,
      params,
    }),
    encodedParams: params,
  };
};

const encodeConvexZapOutData = ({
  params: { token, tokenAmount, vault },
  swapData,
}: {
  params: GetOutZapsDataParamsStrat;
  swapData?: Hex;
}) => {
  const params = encodeAbiParameters(paramsStructDataConvexOut, [
    {
      inputToken: swapData ?? '0x',
    },
  ]);

  return {
    calldata: encodeZapOutData({
      token,
      tokenAmount,
      vault,
      wantType: vault.zapId as ZapTypeCurve,
      params,
    }),
    encodedParams: params,
  };
};

export const getZapsDataForCurveConvex = async (
  params: GetZapsDataParamsStrat,
): Promise<ZapsData> => {
  const { isTokenNative, token, tokenAmount, vault, provider, zapConfig } =
    params;

  if (vault.zapId === undefined) throw new Error('Unknown zapId');

  let tokenDst: Address;

  if (vault.zapId === ZapTypeCurve.CONVEX) {
    const stratContract = getContract({
      abi: strategyConvex,
      address: getAddress(vault.strategy),
      publicClient: provider,
    });

    tokenDst = await stratContract.read.depositToken();
  } else {
    const stratContract = getContract({
      abi: strategyCurveConvex,
      address: getAddress(vault.strategy),
      publicClient: provider,
    });

    const depToWantRoute = await stratContract.read.depositToWantRoute();
    tokenDst = depToWantRoute[0][0];
  }

  const estimate =
    getAddress(tokenDst) !== getAddress(token)
      ? await oneInchEstimateSwap({
          amount: tokenAmount.valueOf(),
          dst: tokenDst ?? zeroAddress,
          params,
        })
      : undefined;

  const zapCalldata = encodeConvexZapData({
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
        // FIXME: real estimated lp token out amount
        BigInt(estimate?.toTokenAmount ?? tokenAmount),
        // TODO: path token metadata to function to be able to get decimals
        estimate?.toToken?.decimals ?? 18,
      ),
      depositTokenName: vault.token,
    },
  };
};

export const getZapsOutDataForCurveConvex = async (
  params: GetOutZapsDataParamsStrat,
): Promise<ZapsOutData> => {
  const { token, tokenAmount, vault, provider, zapConfig } = params;

  if (vault.zapId === undefined) throw new Error('Unknown zapId');

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const zapContract = getContract({
    abi: commonZapOneInchAbi,
    address: getAddress(zapConfig.zapAddress),
    publicClient: provider,
  });

  let encodedParamsForEstimate: Hex;

  let crvTokenIndex: bigint = BigInt(0);
  let crvOutputToken: Address = zeroAddress;

  if (vault.zapId === ZapTypeCurve.CURVE_CONVEX) {
    const wantContract = getContract({
      abi: curveConvexWantToken,
      address: getAddress(vault.tokenAddress ?? zeroAddress),
      publicClient: provider,
    });

    crvTokenIndex = BigInt(0);
    crvOutputToken = await wantContract.read.coins([crvTokenIndex]);

    encodedParamsForEstimate = encodeCurveConvexZapOutData({
      params,
      tokenIndex: crvTokenIndex,
      token: crvOutputToken,
    }).encodedParams;
  } else {
    encodedParamsForEstimate = encodeConvexZapOutData({
      params,
    }).encodedParams;
  }

  const estimatedOutTokens = await estimateZapOutTokens(
    params,
    encodedParamsForEstimate,
  );

  const [outToken, outTokenBalance] = [
    estimatedOutTokens.result[0][0],
    estimatedOutTokens.result[1][0],
  ];

  const estimateSwap =
    getAddress(outToken) !== getAddress(token)
      ? await oneInchEstimateSwap({
          dst: token,
          src: outToken,
          amount: outTokenBalance,
          params,
        })
      : undefined;

  let zapCalldata: Hex;

  // TODO: move to the function
  if (vault.zapId === ZapTypeCurve.CURVE_CONVEX) {
    zapCalldata = encodeCurveConvexZapOutData({
      params,
      tokenIndex: crvTokenIndex,
      tokenOut: token,
      token: crvOutputToken,
      swapData: (estimateSwap?.tx?.data ?? '0x') as Hex,
    }).calldata;
  } else {
    zapCalldata = encodeConvexZapOutData({
      params,
      swapData: (estimateSwap?.tx?.data ?? '0x') as Hex,
    }).calldata;
  }

  return {
    swaps: estimateSwap
      ? [
          {
            from: {
              token: getAddress(estimateSwap.fromToken.address),
              tokenName: estimateSwap.fromToken.name,
              amount: +formatUnits(
                BigInt(estimateSwap.fromTokenAmount),
                estimateSwap.fromToken.decimals,
              ),
            },
            to: {
              token: getAddress(estimateSwap.toToken.address),
              tokenName: estimateSwap.toToken.name,
              amount: +formatUnits(
                BigInt(estimateSwap.toTokenAmount),
                estimateSwap.toToken.decimals,
              ),
            },
            estimate: estimateSwap,
          },
        ]
      : [],
    zapCalldata: {
      to: getAddress(zapConfig.zapAddress),
      calldata: zapCalldata,
    },
    burnLp: [
      {
        estimatedAmount: +formatUnits(
          BigInt(estimateSwap?.fromTokenAmount ?? outTokenBalance),
          estimateSwap?.fromToken?.decimals ?? 18,
        ),
        tokenName: estimateSwap?.fromToken?.name ?? 'unknown',
      },
    ],
    withdraw: {
      estimatedAmount: +formatUnits(
        BigInt(estimateSwap?.toTokenAmount ?? tokenAmount),
        estimateSwap?.toToken?.decimals ?? 18,
      ),
      withdrawTokenName: estimateSwap?.toToken?.name ?? 'unkown',
    },
  };
};
