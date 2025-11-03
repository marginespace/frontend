import { useMemo } from 'react';
import { type Address, formatUnits } from 'viem';
import { erc20ABI, useAccount, useBalance, useContractReads } from 'wagmi';

import { type CubeWithApyAndTvl } from '@/actions/get-all-cubes';
import { type Token, type TokensByName } from '@/actions/get-all-tokens';
import { apiChainToWagmi } from '@/lib/api-chain-to-wagmi';

export const useCubeTokensBalances = (
  cube: CubeWithApyAndTvl,
  chainTokens: TokensByName,
) => {
  const { address } = useAccount();

  const tokenValues = useMemo(() => Object.values(chainTokens), [chainTokens]);
  // const wNative = useMemo(
  //   () => tokenValues.find((token) => token.isWNative),
  //   [tokenValues],
  // );
  const tokens = useMemo(() => {
    const depositFromTokens = cube.zapConfig?.depositFromTokens ?? [];
    const zapTokens = depositFromTokens
      .map((zapToken) => tokenValues.find((token) => token.symbol === zapToken))
      .filter(
        (token) =>
          !!token &&
          token.address !== 'native' &&
          token.symbol !== 'ETH' &&
          token.symbol !== cube.stable,
      ) as Token[];
    return zapTokens;
  }, [cube.zapConfig, tokenValues, cube.stable]);

  const chainId = apiChainToWagmi(cube.network).id;

  const balancesContracts = useMemo(
    () =>
      address
        ? tokens
            .map(
              (token) =>
                ({
                  address: token.address as Address,
                  abi: erc20ABI,
                  functionName: 'balanceOf',
                  chainId,
                  args: [address],
                }) as const,
            )
            .concat([
              {
                address: cube.stableAddress as Address,
                abi: erc20ABI,
                functionName: 'balanceOf',
                chainId,
                args: [address],
              } as const,
            ])
        : [],
    [address, tokens, chainId, cube.stableAddress],
  );

  const allowancesContracts = useMemo(
    () =>
      balancesContracts.map(
        (balanceContract) =>
          ({
            ...balanceContract,
            functionName: 'allowance',
            args: address ? [address, cube.earn] : undefined,
          }) as const,
      ),
    [address, balancesContracts, cube.earn],
  );

  const { data: balances } = useContractReads({
    contracts: balancesContracts,
    allowFailure: false,
    watch: true,
  });

  const { data: allowances } = useContractReads({
    contracts: allowancesContracts,
    allowFailure: false,
    watch: true,
  });

  const { data: nativeBalanceData } = useBalance({
    address,
    watch: true,
    chainId,
  });

  const wNative = useMemo(
    () => Object.values(chainTokens).find((v) => v.isWNative),
    [chainTokens],
  );

  return useMemo<(Token & { balance: bigint; allowance: bigint })[]>(() => {
    if (!balances || !allowances) return [];

    return tokens
      .map((token, index) => ({
        ...token,
        balance: balances[index],
        allowance: allowances[index] as bigint,
      }))
      .concat([
        {
          address: cube.stableAddress ?? '',
          type: 'lp',
          isWNative: false,
          isNative: false,
          chainId: chainId?.toString() ?? '1',
          balance: balances[balances.length - 1] ?? BigInt(0),
          allowance: (allowances[allowances.length - 1] as bigint) ?? BigInt(0),
          name: cube.stable,
          symbol: cube.stable,
          id: 'lp',
          decimals: cube.stableDecimals,
          oracle: '',
          oracleId: '',
        },
        {
          address: wNative?.address ?? '',
          type: 'native',
          isNative: true,
          isWNative: false,
          allowance: BigInt(0),
          balance: nativeBalanceData?.value ?? BigInt(0),
          chainId: chainId.toString(),
          name: nativeBalanceData?.symbol ?? 'Native',
          symbol: nativeBalanceData?.symbol ?? 'Native',
          id: nativeBalanceData?.symbol ?? 'Native',
          decimals: nativeBalanceData?.decimals ?? 18,
          oracleId: '',
          oracle: '',
        },
      ])
      .sort(
        (a, b) =>
          +formatUnits(b.balance ?? BigInt(0), b.decimals ?? 18) -
          +formatUnits(a.balance ?? BigInt(0), a.decimals ?? 18),
      );
  }, [
    allowances,
    balances,
    chainId,
    cube.stable,
    cube.stableAddress,
    cube.stableDecimals,
    nativeBalanceData,
    tokens,
    wNative,
  ]);
};
