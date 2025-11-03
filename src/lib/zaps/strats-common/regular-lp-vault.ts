import {
  type Hex,
  formatUnits,
  getAddress,
  getContract,
  zeroAddress,
} from 'viem';
import { type PublicClient } from 'viem';

import { encodeCommonZapData, encodeCommonZapOutData } from './common';

import {
  type ZapsData,
  type ZapsOutData,
  type GetOutZapsDataParamsStrat,
  type GetZapsDataParamsStrat,
} from '../types';
import { estimateZapOutTokens, oneInchEstimateSwap } from '../utils';

import { uniswapV2PairAbi } from '@/abi/UniswapV2Pair';
import { type Token } from '@/actions/get-all-tokens';
import { type VaultWithApyAndTvl } from '@/actions/get-all-vaults-with-apy-and-tvl';
import { type OneInchSwapEstimateResponse } from '@/actions/zaps/one-inch-estimate';

function sqrt(value: bigint) {
  if (value < BigInt(0)) {
    throw 'square root of negative numbers is not supported';
  }

  if (value < BigInt(2)) {
    return value;
  }

  function newtonIteration(n: bigint, x0: bigint) {
    const x1 = (n / x0 + x0) >> BigInt(1);
    if (x0 === x1 || x0 === x1 - BigInt(1)) {
      return x0;
    }
    return newtonIteration(n, x1);
  }

  return newtonIteration(value, BigInt(1));
}

function min(value1: bigint, value2: bigint) {
  return value2 < value1 ? value2 : value1;
}

const estimateUniV2LpOutput = async ({
  amount0,
  amount1,
  vault,
  provider,
}: {
  amount0: bigint;
  amount1: bigint;
  vault: VaultWithApyAndTvl;
  provider: PublicClient;
}) => {
  const pairContract = getContract({
    abi: uniswapV2PairAbi,
    address: getAddress(vault.tokenAddress ?? zeroAddress),
    publicClient: provider,
  });

  const tts = await pairContract.read.totalSupply();
  let minLiq: bigint;
  try {
    minLiq = await pairContract.read.MINIMUM_LIQUIDITY();
  } catch (e) {
    console.error(e);
    minLiq = BigInt(0);
  }
  const { 0: reserve0, 1: reserve1 } = await pairContract.read.getReserves();

  if (tts === BigInt(0)) {
    return sqrt(amount0 * amount1) - minLiq;
  } else {
    return min((amount0 * tts) / reserve0, (amount1 * tts) / reserve1);
  }
};

export const getZapsDataForRegularLPVaultType = async (
  params: GetZapsDataParamsStrat,
): Promise<ZapsData> => {
  const { isTokenNative, token, tokenAmount, vault, provider, zapConfig } =
    params;

  if (vault.zapId === undefined) throw new Error('Unknown zapId');

  const pairContract = getContract({
    abi: uniswapV2PairAbi,
    address: getAddress(vault.tokenAddress ?? zeroAddress),
    publicClient: provider,
  });

  const pairToken0 = await pairContract.read.token0();
  const pairToken1 = await pairContract.read.token1();

  const tokenLps = vault.lps?.tokens.find(
    (v) => ((v as Token)?.address ?? v) === token,
  );

  const tokenLps1 = vault.lps?.tokens.find(
    (v) => (v as Token)?.address === pairToken0,
  ) as Token | undefined;

  const tokenLps2 = vault.lps?.tokens.find(
    (v) => (v as Token)?.address === pairToken1,
  ) as Token | undefined;

  const shouldDoFewSwaps = !tokenLps;

  const token1 = pairToken0;
  const token2 = pairToken1;

  // if we have 2 swaps, we divide amount on 2 parts
  // first part we swap to lp.token0, second part to lp.token1
  // if inputted token is either lp.token0 or lp.token1 - we swap to missing token
  const swap1 =
    token === token1
      ? undefined
      : {
          token: token1,
          amount: tokenAmount.valueOf() / BigInt(2).valueOf(),
        };

  const swap2 =
    token === token2
      ? undefined
      : {
          token: token2,
          amount: shouldDoFewSwaps
            ? tokenAmount.valueOf() - (swap1?.amount ?? BigInt(0))
            : tokenAmount.valueOf() / BigInt(2).valueOf(),
        };

  const estimatedSwap1 = swap1
    ? await oneInchEstimateSwap({
        amount: swap1.amount,
        dst: swap1.token,
        params,
      })
    : undefined;

  const estimatedSwap2 = swap2
    ? await oneInchEstimateSwap({
        amount: swap2.amount.valueOf(),
        dst: swap2.token,
        params,
      })
    : undefined;

  const amount0 = BigInt(
    estimatedSwap1?.toTokenAmount ??
      (token === token1 ? swap2?.amount : swap1?.amount) ??
      BigInt(0),
  );
  const amount1 = BigInt(
    estimatedSwap2?.toTokenAmount ??
      (token === token2 ? swap1?.amount : swap2?.amount) ??
      BigInt(0),
  );

  const estimatedLp = await estimateUniV2LpOutput({
    amount0,
    amount1,
    provider,
    vault,
  });

  const zapCalldata = encodeCommonZapData({
    isTokenNative,
    swapData1: (estimatedSwap1?.tx?.data ?? '0x') as Hex,
    swapData2: (estimatedSwap2?.tx?.data ?? '0x') as Hex,
    token,
    tokenAmount: tokenAmount.valueOf(),
    vault,
    wantType: vault.zapId,
  });

  const swapsArr: OneInchSwapEstimateResponse[] = [];

  if (estimatedSwap1) {
    swapsArr.push(estimatedSwap1);
  }

  if (estimatedSwap2) {
    swapsArr.push(estimatedSwap2);
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
      value: isTokenNative ? tokenAmount.valueOf() : undefined,
    },
    buildLp: [
      {
        estimatedAmount: +formatUnits(amount0, tokenLps1?.decimals ?? 18),
        tokenName: tokenLps1?.symbol ?? 'unknown',
      },
      {
        estimatedAmount: +formatUnits(amount1, tokenLps2?.decimals ?? 18),
        tokenName: tokenLps2?.symbol ?? 'unknown',
      },
    ],
    deposit: {
      estimatedAmount: +formatUnits(estimatedLp, 18),
      depositTokenName: vault.token,
    },
  };
};

export const getZapsOutDataForRegularLPVaultType = async (
  params: GetOutZapsDataParamsStrat,
): Promise<ZapsOutData> => {
  const { token, tokenAmount, vault, zapConfig } = params;

  if (vault.zapId === undefined) throw new Error('Unknown zapId');

  const tokenOutAmount = await estimateZapOutTokens(params);

  const pairToken0 = tokenOutAmount.result[0][0];
  const pairToken1 = tokenOutAmount.result[0][1];

  const tokenLps1 = vault.lps?.tokens.find(
    (v) => (v as Token)?.address === pairToken0,
  ) as Token | undefined;

  const tokenLps2 = vault.lps?.tokens.find(
    (v) => (v as Token)?.address === pairToken1,
  ) as Token | undefined;

  const token1 = pairToken0;
  const token2 = pairToken1;

  const amount0 = tokenOutAmount.result[1][0];
  const amount1 = tokenOutAmount.result[1][1];

  // if we have 2 swaps, we divide amount on 2 parts
  // first part we swap to lp.token0, second part to lp.token1
  // if inputted token is either lp.token0 or lp.token1 - we swap to missing token
  const swap1 =
    token === token1
      ? undefined
      : {
          token: token,
          amount: amount0,
        };

  const swap2 =
    token === token2
      ? undefined
      : {
          token: token,
          amount: amount1,
        };

  const estimatedSwap1 = swap1
    ? await oneInchEstimateSwap({
        amount: swap1.amount,
        src: token1,
        params,
      })
    : undefined;

  const estimatedSwap2 = swap2
    ? await oneInchEstimateSwap({
        amount: swap2.amount.valueOf(),
        src: token2,
        params,
      })
    : undefined;

  const zapCalldata = encodeCommonZapOutData({
    swapData1: (estimatedSwap1?.tx?.data ?? '0x') as Hex,
    swapData2: (estimatedSwap2?.tx?.data ?? '0x') as Hex,
    token,
    tokenAmount: tokenAmount.valueOf(),
    vault,
    wantType: vault.zapId,
  });

  const swapsArr: OneInchSwapEstimateResponse[] = [];

  if (estimatedSwap1) {
    swapsArr.push(estimatedSwap1);
  }

  if (estimatedSwap2) {
    swapsArr.push(estimatedSwap2);
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
    burnLp: [
      {
        estimatedAmount: +formatUnits(amount0, tokenLps1?.decimals ?? 18),
        tokenName: tokenLps1?.symbol ?? 'unknown',
      },
      {
        estimatedAmount: +formatUnits(amount1, tokenLps2?.decimals ?? 18),
        tokenName: tokenLps2?.symbol ?? 'unknown',
      },
    ],
    withdraw: {
      estimatedAmount: +formatUnits(
        BigInt(estimatedSwap1?.toTokenAmount ?? '0') +
          BigInt(estimatedSwap2?.toTokenAmount ?? '0'),
        estimatedSwap1?.toToken?.decimals ??
          estimatedSwap2?.toToken?.decimals ??
          18,
      ),
      withdrawTokenName: params.tokenMetadata.symbol,
    },
  };
};
