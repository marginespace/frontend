import {
  type Address,
  encodeAbiParameters,
  formatUnits,
  getAddress,
  getContract,
  type Hex,
  zeroAddress,
} from 'viem';

import { curveConvexWantToken } from '@/abi/CurveConvexWantToken';
import { strategyConvex } from '@/abi/StrategyConvex';
import { strategyCurveLPUniV3RouterAbi } from '@/abi/StrategyCurveLPUniV3Router';
import { type VaultWithApyAndTvl } from '@/actions/get-all-vaults-with-apy-and-tvl';
import { type ZapTypeCurve } from '@/lib/zaps/strats-curve/common';
import {
  type GetOutZapsDataParamsStrat,
  type GetZapsDataParamsStrat,
  type ZapsData,
  type ZapsOutData,
} from '@/lib/zaps/types';
import {
  encodeZapData,
  encodeZapOutData,
  estimateZapOutTokens,
  oneInchEstimateSwap,
} from '@/lib/zaps/utils';

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

const paramsStructDataCurveOpOut = [
  {
    components: [
      {
        name: 'tokenIndex',
        type: 'uint256',
      },
      {
        name: 'token',
        type: 'address',
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

export const getZapsDataForCurveOp = async (
  params: GetZapsDataParamsStrat,
): Promise<ZapsData> => {
  const { isTokenNative, token, tokenAmount, vault, provider, zapConfig } =
    params;

  if (vault.zapId === undefined) throw new Error('Unknown zapId');

  const stratContract = getContract({
    abi: strategyConvex,
    address: getAddress(vault.strategy),
    publicClient: provider,
  });

  const tokenDst = await stratContract.read.depositToken();

  const estimate =
    getAddress(tokenDst) !== getAddress(token)
      ? await oneInchEstimateSwap({
          amount: tokenAmount.valueOf(),
          dst: tokenDst ?? zeroAddress,
          params,
        })
      : undefined;

  const zapCalldata = encodeCurveOpZapData({
    isTokenNative,
    swapData: (estimate?.tx?.data ?? '0x') as Hex,
    token,
    tokenAmount: tokenAmount.valueOf(),
    vault,
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

export const getZapsOutDataForCurveOp = async (
  params: GetOutZapsDataParamsStrat,
): Promise<ZapsOutData> => {
  const { token, tokenAmount, vault, provider, zapConfig } = params;

  if (vault.zapId === undefined) throw new Error('Unknown zapId');

  const wantContract = getContract({
    abi: curveConvexWantToken,
    address: getAddress(vault.tokenAddress ?? zeroAddress),
    publicClient: provider,
  });

  const strategyContract = getContract({
    abi: strategyCurveLPUniV3RouterAbi,
    address: getAddress(vault.strategy ?? zeroAddress),
    publicClient: provider,
  });

  const crvTokenIndex = BigInt(1);
  const poolSize = await strategyContract.read.poolSize();
  let crvOutputToken: Address;
  if (poolSize === BigInt(2)) {
    crvOutputToken = await wantContract.read.coins([crvTokenIndex]);
  } else {
    const secondCoinAddress = await wantContract.read.coins([crvTokenIndex]);
    const secondWantContract = getContract({
      abi: curveConvexWantToken,
      address: secondCoinAddress,
      publicClient: provider,
    });

    crvOutputToken = await secondWantContract.read.coins([crvTokenIndex]);
  }

  const encodedParamsForEstimate = encodeCurveOpZapOutData({
    params,
    tokenIndex: crvTokenIndex,
    token: crvOutputToken,
  }).encodedParams;

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

  const zapCalldata = encodeCurveOpZapOutData({
    params,
    tokenIndex: crvTokenIndex,
    tokenOut: token,
    token: crvOutputToken,
    swapData: (estimateSwap?.tx?.data ?? '0x') as Hex,
  }).calldata;

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

const encodeCurveOpZapData = ({
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

const encodeCurveOpZapOutData = ({
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
  const params = encodeAbiParameters(paramsStructDataCurveOpOut, [
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
