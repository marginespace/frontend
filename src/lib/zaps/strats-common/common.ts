import { type Address, encodeAbiParameters, type Hex } from 'viem';

import { encodeZapData, encodeZapOutData } from '../utils';

import { type VaultWithApyAndTvl } from '@/actions/get-all-vaults-with-apy-and-tvl';

const paramsStructData = [
  {
    components: [
      {
        name: '_inputToken0',
        type: 'address',
      },
      {
        name: '_inputToken1',
        type: 'address',
      },
      {
        name: '_token0',
        type: 'bytes',
      },
      {
        name: '_token1',
        type: 'bytes',
      },
    ],
    name: 'params',
    type: 'tuple',
  },
] as const;

const paramsOutStructData = [
  {
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
    type: 'tuple',
  },
] as const;

export enum ZapTypeCommon {
  SINGLE = 0,
  SINGLE_GOV,
  UNISWAP_V2_LP,
  SOLIDLY_STABLE_LP,
  SOLIDLY_VOLATILE_LP,
  STARGATE,
}

export const encodeCommonZapData = ({
  isTokenNative,
  token,
  tokenAmount,
  vault,
  swapData1,
  swapData2,
  wantType,
}: {
  token: Address;
  tokenAmount: bigint;
  isTokenNative: boolean;
  vault: VaultWithApyAndTvl;
  swapData1: Hex;
  swapData2: Hex;
  wantType: number;
}) => {
  const params = encodeAbiParameters(paramsStructData, [
    {
      _inputToken0: token,
      _inputToken1: token,
      _token0: swapData1,
      _token1: swapData2,
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

export const encodeCommonZapOutData = ({
  token,
  tokenAmount,
  vault,
  swapData1,
  swapData2,
  wantType,
}: {
  token: Address;
  tokenAmount: bigint;
  vault: VaultWithApyAndTvl;
  swapData1: Hex;
  swapData2: Hex;
  wantType: number;
}) => {
  const params = encodeAbiParameters(paramsOutStructData, [
    {
      token0: swapData1,
      token1: swapData2,
    },
  ]);

  return encodeZapOutData({
    params,
    token,
    tokenAmount: tokenAmount.valueOf(),
    vault,
    wantType,
  });
};
