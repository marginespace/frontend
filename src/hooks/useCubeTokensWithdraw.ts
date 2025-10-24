import { useMemo } from 'react';

import { type CubeWithApyAndTvl } from '@/actions/get-all-cubes';
import { type Token, type TokensByName } from '@/actions/get-all-tokens';
import { apiChainToWagmi } from '@/lib/api-chain-to-wagmi';

export const useCubeTokensWithdraw = (
  cube: CubeWithApyAndTvl,
  chainTokens: TokensByName,
) => {
  const tokenValues = useMemo(() => Object.values(chainTokens), [chainTokens]);

  const tokens = useMemo(
    () =>
      (cube.zapConfig?.withdrawToTokens
        ?.map((zapToken) =>
          tokenValues.find((token) => token.symbol === zapToken),
        )
        .filter(
          (token) =>
            !!token &&
            token.address !== 'native' &&
            token.symbol !== 'ETH' &&
            token.symbol !== cube.stable,
        ) as Token[]) ?? [],
    [cube.stable, cube.zapConfig, tokenValues],
  );

  const chain = apiChainToWagmi(cube.network);
  const chainId = chain.id;

  const wNative = useMemo(
    () => Object.values(chainTokens).find((v) => v.isWNative),
    [chainTokens],
  );

  return useMemo<Token[]>(
    () =>
      tokens.concat([
        {
          address: cube.stableAddress,
          type: 'lp',
          isWNative: false,
          isNative: false,
          chainId: chainId.toString(),
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
          chainId: chainId.toString(),
          name: chain.nativeCurrency?.name ?? 'Native',
          symbol: chain.nativeCurrency?.symbol ?? 'Native',
          id: chain.nativeCurrency?.name ?? 'Native',
          decimals: wNative?.decimals ?? 18,
          oracleId: '',
          oracle: '',
        },
      ]),
    [
      chain.nativeCurrency,
      chainId,
      cube.stable,
      cube.stableAddress,
      cube.stableDecimals,
      tokens,
      wNative,
    ],
  );
};
