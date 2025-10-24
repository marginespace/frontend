import { useMemo } from 'react';
import { type Address, zeroAddress } from 'viem';
import { erc20ABI, useAccount, useContractReads } from 'wagmi';

export type UseTokensApprovesParams = {
  token: Address;
  spender: Address;
}[];

export const useTokenAllowances = (params: UseTokensApprovesParams) => {
  const { address } = useAccount();
  const contracts = useMemo(
    () =>
      params.map(
        ({ token, spender }) =>
          ({
            address: token,
            abi: erc20ABI,
            functionName: 'allowance',
            args: [address ?? zeroAddress, spender],
          }) as const,
      ),
    [address, params],
  );

  const results = useContractReads({
    enabled: !!address,
    allowFailure: true,
    contracts,
  });

  return {
    tokenAllowances: results.data
      ? results.data
      : new Array(params.length).fill(BigInt(0)),
    isTokenAllowancesFailed: results.isError,
    isTokenAllowancesLoading: results.isLoading,
  };
};
