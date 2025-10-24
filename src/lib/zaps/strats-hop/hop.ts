import {
  type Address,
  formatUnits,
  getAddress,
  getContract,
  type Hex,
} from 'viem';

import { strategyStrategyHopAbi } from '@/abi/StrategyHop';
import { type VaultWithApyAndTvl } from '@/actions/get-all-vaults-with-apy-and-tvl';
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

export const getZapsDataForHop = async (
  params: GetZapsDataParamsStrat,
): Promise<ZapsData> => {
  const { isTokenNative, token, tokenAmount, vault, provider, zapConfig } =
    params;

  if (vault.zapId === undefined) throw new Error('Unknown zapId');

  const strategyContract = getContract({
    abi: strategyStrategyHopAbi,
    address: getAddress(vault.strategy),
    publicClient: provider,
  });

  const tokenDst = await strategyContract.read.depositToken();

  const estimate =
    token !== tokenDst
      ? await oneInchEstimateSwap({
          amount: tokenAmount.valueOf(),
          dst: tokenDst,
          params,
        })
      : undefined;

  const zapCalldata = encodeHopZapData({
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

export const getZapsDataOutForHop = async (
  params: GetOutZapsDataParamsStrat,
) => {
  const { token, tokenAmount, vault, zapConfig } = params;

  if (vault.zapId === undefined) {
    throw new Error('unknown zap id');
  }

  const tokensOutAmount = await estimateZapOutTokens(params, '0x');

  const src = tokensOutAmount?.result[0][0];
  const srcAmount = tokensOutAmount?.result[1][0];

  const estimate1 =
    token !== src
      ? await oneInchEstimateSwap({
          dst: token,
          src: src,
          amount: srcAmount,
          params,
        })
      : undefined;

  const zapCalldata = encodeHopZapOutData({
    token,
    tokenAmount,
    vault,
    swapData: (estimate1?.tx.data as Hex) ?? '0x',
  });

  return {
    swaps: !estimate1
      ? []
      : [
          {
            from: {
              token: getAddress(estimate1.fromToken.address),
              tokenName: estimate1.fromToken.symbol,
              amount: +formatUnits(
                BigInt(estimate1.fromTokenAmount),
                estimate1.fromToken.decimals,
              ),
            },
            to: {
              token: getAddress(estimate1.toToken.address),
              tokenName: estimate1.toToken.symbol,
              amount: +formatUnits(
                BigInt(estimate1.toTokenAmount),
                estimate1.toToken.decimals,
              ),
            },
            estimate: estimate1,
          },
        ],

    zapCalldata: {
      to: getAddress(zapConfig.zapAddress),
      calldata: zapCalldata,
    },
    withdraw: {
      estimatedAmount: +formatUnits(
        BigInt(estimate1?.toTokenAmount ?? srcAmount),
        params.tokenMetadata.decimals,
      ),
      withdrawTokenName: vault.token,
    },
  };
};

export const encodeHopZapData = ({
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

export const encodeHopZapOutData = ({
  token,
  tokenAmount,
  vault,
  swapData,
}: {
  token: Address;
  tokenAmount: bigint;
  vault: VaultWithApyAndTvl;
  swapData: Hex;
}) => {
  return encodeZapOutData({
    token,
    tokenAmount,
    vault,
    wantType: 0,
    params: swapData,
  });
};
