import { useMemo } from 'react';

import { type Token, type TokensByName } from '@/actions/get-all-tokens';
import { type VaultWithApyAndTvl } from '@/actions/get-all-vaults-with-apy-and-tvl';
import { apiChainToWagmi } from '@/lib/api-chain-to-wagmi';

export const useVaultTokensWithdraw = (
  vault: VaultWithApyAndTvl,
  chainTokens: TokensByName,
) => {
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
      vault.zapConfig?.withdrawToTokens &&
      vault.zapConfig.withdrawToTokens.length > 0
        ? (vault.zapConfig.withdrawToTokens
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

  const chain = apiChainToWagmi(vault.chain);
  const chainId = chain.id;

  return useMemo<Token[]>(() => {
    return tokens.concat([
      {
        address: wNative?.address ?? 'native',
        type: 'native',
        isNative: true,
        isWNative: false,
        chainId: chainId.toString(),
        name: chain.nativeCurrency.name,
        symbol: chain.nativeCurrency.symbol,
        id: chain.nativeCurrency.symbol,
        decimals: chain.nativeCurrency.decimals,
        oracleId: '',
        oracle: '',
      },
    ]);
  }, [
    chain.nativeCurrency.decimals,
    chain.nativeCurrency.name,
    chain.nativeCurrency.symbol,
    chainId,
    tokens,
    wNative,
  ]);
};
