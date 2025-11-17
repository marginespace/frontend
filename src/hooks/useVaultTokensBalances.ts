import { useMemo } from 'react';
import { formatUnits } from 'viem';
import {
  erc20ABI,
  useAccount,
  useBalance,
  useContractRead,
  useContractReads,
} from 'wagmi';

import { type Token, type TokensByName } from '@/actions/get-all-tokens';
import { type VaultWithApyAndTvl } from '@/actions/get-all-vaults-with-apy-and-tvl';
import { apiChainToWagmi } from '@/lib/api-chain-to-wagmi';

export const useVaultTokensBalances = (
  vault: VaultWithApyAndTvl,
  chainTokens: TokensByName,
  zapAddress?: string,
) => {
  const { address } = useAccount();
  const tokenValues = useMemo(
    () => (chainTokens ? Object.values(chainTokens) : []),
    [chainTokens],
  );

  const tokens = useMemo(() => {
    const lpsTokens = (vault.lps?.tokens
      ?.filter?.(
        (token) =>
          !!token && typeof token !== 'string' && token.id !== 'native',
      )
      ?.map((token) => {
        return token;
      }) ?? []) as Token[];
    const zapTokens =
      vault.zapConfig?.depositFromTokens &&
      vault.zapConfig.depositFromTokens.length > 0
        ? (vault.zapConfig.depositFromTokens
            .map((zapToken) =>
              tokenValues.find((token) => token.symbol === zapToken),
            )
            .filter(
              (token) =>
                !!token &&
                token.address !== 'native' &&
                token.symbol !== 'ETH' &&
                token.symbol !== 'USDT' &&
                !lpsTokens.some((lpsToken) => lpsToken.symbol === token.symbol),
            ) as Token[])
        : [];

    return zapTokens.concat(lpsTokens);
  }, [tokenValues, vault.lps, vault.zapConfig]);

  const wNative = useMemo(
    () => Object.values(chainTokens).find((v) => v.isWNative),
    [chainTokens],
  );

  const chainId = apiChainToWagmi(vault.chain).id;

  const balancesContracts = useMemo(
    () =>
      address
        ? tokens.map(
            (token) =>
              ({
                address: token.address as `0x${string}`,
                abi: erc20ABI,
                functionName: 'balanceOf',
                chainId,
                args: [address],
              }) as const,
          )
        : [],
    [address, tokens, chainId],
  );
  const allowancesContracts = useMemo(
    () =>
      balancesContracts.map(
        (balanceContract) =>
          ({
            ...balanceContract,
            functionName: 'allowance',
            args: address
              ? [
                  address,
                  balanceContract.address === vault.tokenAddress
                    ? vault.earnContractAddress
                    : zapAddress ?? vault.earnContractAddress,
                ]
              : undefined,
          }) as const,
      ),
    [
      address,
      balancesContracts,
      vault.earnContractAddress,
      vault.tokenAddress,
      zapAddress,
    ],
  );

  const { data: decimals } = useContractRead({
    abi: erc20ABI,
    address: vault.tokenAddress as `0x${string}`,
    functionName: 'decimals',
    chainId,
  });

  const { data: balances } = useContractReads({
    contracts: balancesContracts,
    allowFailure: false,
    watch: true,
  });

  const { data: nativeBalanceData } = useBalance({
    address,
    watch: true,
    chainId,
  });

  const { data: allowances } = useContractReads({
    contracts: allowancesContracts,
    allowFailure: false,
    watch: true,
  });

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
          address: wNative?.address ?? 'native',
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
    balances,
    allowances,
    tokens,
    chainId,
    wNative,
    nativeBalanceData,
  ]);
};
