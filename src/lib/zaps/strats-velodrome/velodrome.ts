import {
  type Address,
  encodeAbiParameters,
  formatUnits,
  getAddress,
  getContract,
  type Hex,
} from 'viem';

import { strategyCommonVelodromeGaugeV2Abi } from '@/abi/StrategyCommonVelodromeGaugeV2';
import { type VaultWithApyAndTvl } from '@/actions/get-all-vaults-with-apy-and-tvl';
import { type OneInchSwapEstimateResponse } from '@/actions/zaps/one-inch-estimate';
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

const paramsStructOutData = [
  {
    name: 'params',
    type: 'tuple',
    components: [
      {
        name: 'token0',
        type: 'bytes',
      },
      {
        name: 'token1',
        type: 'bytes',
      },
    ],
  },
] as const;

export const getZapsDataForVelodrome = async (
  params: GetZapsDataParamsStrat,
): Promise<ZapsData> => {
  const { isTokenNative, token, tokenAmount, vault, provider, zapConfig } =
    params;

  if (vault.zapId === undefined) throw new Error('Unknown zapId');

  const strategyContract = getContract({
    abi: strategyCommonVelodromeGaugeV2Abi,
    address: getAddress(vault.strategy),
    publicClient: provider,
  });

  const tokenDst = await strategyContract.read.output();

  const estimate =
    token !== tokenDst
      ? await oneInchEstimateSwap({
          amount: tokenAmount.valueOf(),
          dst: tokenDst,
          params,
        })
      : undefined;

  const zapCalldata = encodeVelodromeZapData({
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
        BigInt(estimate?.toTokenAmount ?? tokenAmount),
        estimate?.toToken?.decimals ?? 18,
      ),
      depositTokenName: vault.token,
    },
  };
};

export const getZapsDataOutForVelodrome = async (
  params: GetOutZapsDataParamsStrat,
) => {
  const { token, tokenAmount, vault, zapConfig } = params;

  if (vault.zapId === undefined) {
    throw new Error('unknown zap id');
  }

  const swapsArr: OneInchSwapEstimateResponse[] = [];

  const mockedEncodedData = encodeAbiParameters(paramsStructOutData, [
    {
      token0: '0x',
      token1: '0x',
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

  const zapCalldata = encodeVelodromeZapDataOut({
    token,
    tokenAmount,
    vault,
    token0: (estimate1?.tx?.data ?? '0x') as Hex,
    token1: (estimate2?.tx?.data ?? '0x') as Hex,
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

export const encodeVelodromeZapData = ({
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
  return encodeZapData({
    isTokenNative,
    token,
    tokenAmount,
    vault,
    wantType: 0,
    params: swapData,
  });
};

export const encodeVelodromeZapDataOut = ({
  token0,
  token1,
  token,
  tokenAmount,
  vault,
}: {
  token: Address;
  tokenAmount: bigint;
  vault: VaultWithApyAndTvl;
  token0: Hex;
  token1: Hex;
}) => {
  const params = encodeAbiParameters(paramsStructOutData, [
    {
      token0,
      token1,
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
