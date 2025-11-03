import { type Address, encodeAbiParameters, type Hex } from 'viem';

import { type VaultWithApyAndTvl } from '@/actions/get-all-vaults-with-apy-and-tvl';
import { encodeZapData, encodeZapOutData } from '@/lib/zaps/utils';

export enum ZapTypeBalancer {
  WANT_TYPE_BALANCER_AURA = 0,
  WANT_TYPE_BALANCER_AURA_MULTI_REWARD = 1,
  WANT_TYPE_BALANCER_AURA_GYRO = 2,
}

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

export const auraParamsOutStructData = [
  {
    name: 'params',
    type: 'tuple',
    components: [
      {
        name: 'tokenOut',
        type: 'address',
      },
      {
        name: 'tokenIndexRoute',
        type: 'uint256',
      },
      {
        name: 'inputToken',
        type: 'bytes',
      },
    ],
  },
];

export const auraGyroParamsOutStructData = [
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
];

export const encodeBalancerZapData = ({
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
  wantType: ZapTypeBalancer;
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

export const encodeBalancerZapOutDataAura = ({
  token,
  tokenOutIndex,
  tokenOut,
  tokenAmount,
  vault,
  swapData,
  wantType,
}: {
  token: Address;
  tokenOutIndex: number;
  tokenOut: Address;
  tokenAmount: bigint;
  vault: VaultWithApyAndTvl;
  swapData: Hex;
  wantType: ZapTypeBalancer;
}) => {
  const params = encodeAbiParameters(auraParamsOutStructData, [
    {
      tokenOut,
      tokenIndexRoute: tokenOutIndex,
      inputToken: swapData,
    },
  ]);

  return encodeZapOutData({
    token,
    tokenAmount,
    vault,
    wantType,
    params,
  });
};

export const encodeBalancerZapOutDataGyro = ({
  token0,
  token1,
  token,
  tokenAmount,
  vault,
  wantType,
}: {
  token: Address;
  tokenAmount: bigint;
  vault: VaultWithApyAndTvl;
  token0: Hex;
  token1: Hex;
  wantType: ZapTypeBalancer;
}) => {
  const params = encodeAbiParameters(auraGyroParamsOutStructData, [
    {
      token0,
      token1,
    },
  ]);

  return encodeZapOutData({
    token,
    tokenAmount,
    vault,
    wantType,
    params,
  });
};
