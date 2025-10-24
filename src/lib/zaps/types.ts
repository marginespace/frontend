import { type Address, type Hex } from 'viem';

import { type AppPublicClient } from '../viem-clients';

import { type Token } from '@/actions/get-all-tokens';
import { type VaultWithApyAndTvl } from '@/actions/get-all-vaults-with-apy-and-tvl';
import { type ZapConfigsResponse } from '@/actions/zaps/get-all-zap-configs';
import { type OneInchSwapEstimateResponse } from '@/actions/zaps/one-inch-estimate';

export type GetZapsDataParams = {
  readonly from: Address;

  readonly token: Address;
  readonly tokenMetadata: Token;
  readonly isTokenNative: boolean;
  readonly tokenAmount: bigint;
  readonly slippage: number;

  readonly vault: VaultWithApyAndTvl;
  readonly zapConfig: ZapConfigsResponse[number];
  readonly provider: AppPublicClient;
  readonly signal?: AbortSignal;
};

export type GetOutZapsDataParams = Omit<GetZapsDataParams, 'isTokenNative'>;

export type GetZapsDataParamsStrat = Omit<GetZapsDataParams, 'zapConfig'> & {
  zapConfig: GetZapsDataParams['zapConfig'] & {
    zapAddress: string;
  };
};

export type GetOutZapsDataParamsStrat = Omit<
  GetOutZapsDataParams,
  'zapConfig'
> & {
  zapConfig: GetZapsDataParamsStrat['zapConfig'];
};

export type ZapsData = {
  swaps: {
    from: {
      token: Address;
      tokenName: string;
      amount: number;
    };
    to: {
      token: Address;
      tokenName: string;
      amount: number;
    };
    estimate: OneInchSwapEstimateResponse;
  }[];
  buildLp?: {
    estimatedAmount: number;
    tokenName: string;
  }[];
  zapCalldata: {
    to: Address;
    calldata: Hex;
    value?: bigint;
  };
  deposit: {
    estimatedAmount: number;
    depositTokenName: string;
  };
};

export type ZapsOutData = {
  swaps: {
    from: {
      token: Address;
      tokenName: string;
      amount: number;
    };
    to: {
      token: Address;
      tokenName: string;
      amount: number;
    };
    estimate: OneInchSwapEstimateResponse;
  }[];
  burnLp?: {
    estimatedAmount: number;
    tokenName: string;
  }[];
  zapCalldata: {
    to: Address;
    calldata: Hex;
  };
  withdraw: {
    estimatedAmount: number;
    withdrawTokenName: string;
  };
};
