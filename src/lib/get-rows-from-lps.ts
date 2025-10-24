import { type VaultWithApyAndTvl } from '@/actions/get-all-vaults-with-apy-and-tvl';

type Row = {
  name: string;
  amount: number;
  value: number;
  progress: number;
};

export const getRowsFromLps = (vault: VaultWithApyAndTvl) => {
  const lps = vault.lps;
  if (!lps) {
    return [];
  }

  if (!vault.isMultiToken) {
    return [
      {
        name: vault.assets[0],
        amount: vault.totalSupply,
        value: vault.totalSupply * (vault.lps?.price ?? 0),
        progress: 100,
      },
    ];
  }

  if (!lps.tokens) {
    return [];
  }
  const balances = lps.balances.map(parseFloat);
  const values = lps.tokens.map((token, index) =>
    !token || typeof token === 'string' || !token.price
      ? 0
      : token.price * balances[index],
  );
  const totalValue = values.reduce((acc, value) => acc + value, 0) || 1;
  const tokens = lps.tokens.map((token, index) =>
    token && typeof token !== 'string'
      ? {
          name: token.symbol,
          amount: balances[index],
          value: values[index],
          progress: (values[index] / totalValue) * 100,
        }
      : undefined,
  );
  return tokens.filter((token) => !!token) as Row[];
};
