import {
  type Address,
  type Hex,
  encodeFunctionData,
  getAddress,
  zeroAddress,
} from 'viem';

import { ZapTypeCommon } from './strats-common/common';
import {
  type GetOutZapsDataParamsStrat,
  type GetZapsDataParams,
  type GetZapsDataParamsStrat,
} from './types';

import { getStateDiffForMockedAllowance } from '../mock-allowance';
import { simulateContractWithStateDiff } from '../viem-clients';

import { commonZapOneInchAbi } from '@/abi/CommonZapOneInch';
import { type VaultWithApyAndTvl } from '@/actions/get-all-vaults-with-apy-and-tvl';
import { ZapCategory } from '@/actions/zaps/get-all-zap-configs';
import { oneInchEstimate } from '@/actions/zaps/one-inch-estimate';

type OneInchEstimateSwap = Omit<
  GetZapsDataParamsStrat | GetOutZapsDataParamsStrat,
  'isTokenNative'
>;

export const oneInchEstimateSwap = ({
  dst,
  src,
  amount,
  params,
}: {
  src?: Address | string;
  dst?: Address | string;
  amount?: bigint;
  params: OneInchEstimateSwap;
}) =>
  oneInchEstimate({
    amount: amount ?? params.tokenAmount,
    disableEstimate: true,
    dst: getAddress(dst ?? params.token),
    src: getAddress(src ?? params.token),
    from: params.zapConfig.zapAddress,
    receiver: params.zapConfig.zapAddress,
    network: params.vault.network,
    slippage: params.slippage,

    referrer: params.zapConfig.fee.recipient, // TODO: change
    signal: params.signal,
  });

export const getZapAddressForCategory = (
  config: GetZapsDataParams['zapConfig'],
  category: ZapCategory,
) => {
  return config?.strategies?.find((v) => v.category === category)?.address;
};

export const encodeZapData = ({
  isTokenNative,
  token,
  tokenAmount,
  vault,
  params,
  wantType,
}: {
  token: Address;
  tokenAmount: bigint;
  isTokenNative: boolean;
  params: Hex;
  vault: VaultWithApyAndTvl;
  wantType: number;
}) => {
  return isTokenNative
    ? encodeFunctionData({
        abi: commonZapOneInchAbi,
        args: [getAddress(vault.earnContractAddress), wantType, params],
        functionName: 'beefInETH',
      })
    : encodeFunctionData({
        abi: commonZapOneInchAbi,
        args: [
          getAddress(vault.earnContractAddress),
          token,
          tokenAmount,
          wantType,
          params,
        ],
        functionName: 'beefIn',
      });
};

export const encodeZapOutData = ({
  token,
  tokenAmount,
  vault,
  params,
  wantType,
}: {
  token: Address;
  tokenAmount: bigint;
  vault: VaultWithApyAndTvl;
  params: Hex;
  wantType: number;
}) => {
  return encodeFunctionData({
    abi: commonZapOneInchAbi,
    args: [
      getAddress(vault.earnContractAddress),
      tokenAmount,
      wantType,
      token,
      params,
    ],
    functionName: 'beefOutAndSwap',
  });
};

export const estimateZapOutTokens = async (
  params: GetOutZapsDataParamsStrat,
  encodedParams?: Hex,
) => {
  if (params.vault.zapId === undefined) throw new Error('Invalid zapId');

  // precomputed slot index for all VaultV7 tokens
  let mappingSlot = 52;

  if (
    params.vault.zapCategory === ZapCategory.COMMON &&
    params.vault.zapId === ZapTypeCommon.SINGLE_GOV
  ) {
    // precomputed slot index for RewardsPool token
    mappingSlot = 9;
  }

  const stateOverride = getStateDiffForMockedAllowance({
    allowanceMappingSlot: mappingSlot,
    owner: params.from,
    spender: getAddress(params.zapConfig.zapAddress),
    tokenAddress: getAddress(params.vault.earnContractAddress ?? zeroAddress),
  });

  return await simulateContractWithStateDiff(params.provider, {
    abi: commonZapOneInchAbi,
    address: getAddress(params.zapConfig.zapAddress),
    functionName: 'beefOutBalances',
    stateDiff: stateOverride,
    account: params.from,
    args: [
      params.vault.earnContractAddress as Address,
      params.tokenAmount,
      params.vault.zapId,
      encodedParams ?? '0x',
    ],
  });
};
