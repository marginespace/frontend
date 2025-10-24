import { API_URL } from '@/constants/api';

const TOKENS_URL = API_URL + '/tokens';

export type Token = {
  type: string;
  id: string;
  isWNative: boolean;
  isNative: boolean;
  symbol: string;
  name: string;
  chainId: string;
  oracle: string;
  oracleId: string;
  address: string;
  decimals: number;
};
export type TokensByName = Record<string, Token>;
export type TokensByChain = Record<string, TokensByName>;

export const getAllTokens = async (): Promise<TokensByChain> => {
  try {
    const tokens = (await fetch(TOKENS_URL).then((res) =>
      res.json(),
    )) as TokensByChain;
    const tokensByAddress = {} as TokensByChain;
    for (const chainName in tokens) {
      tokensByAddress[chainName] = {};
      for (const tokenId in tokens[chainName]) {
        const token = tokens[chainName][tokenId];
        tokensByAddress[chainName][token.address] = {
          ...token,
          isWNative: tokenId === 'WNATIVE',
          isNative: token.address === 'native',
        };
      }
    }
    return tokensByAddress;
  } catch (error) {
    console.error(error);
    return {};
  }
};
