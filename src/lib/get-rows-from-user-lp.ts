import { type CubeWithApyAndTvl } from '@/actions/get-all-cubes';
import { type VaultWithApyAndTvl } from '@/actions/get-all-vaults-with-apy-and-tvl';

type Row = {
  name: string;
  amount: number;
  value: number;
  progress: number;
};

interface CubeVault {
  part: number;
}

export const getRowsUserFromLps = (
  vault: VaultWithApyAndTvl & CubeVault,
  cube: CubeWithApyAndTvl,
  deposit: number,
) => {
  const vaultPart = vault.part / 100;
  const lps = vault.lps;

  if (!lps) {
    return [];
  }

  if (!vault.isMultiToken) {
    return [
      {
        name: vault.assets[0],
        amount: (deposit / (vault.lps?.price ?? 0)) * vaultPart,
        value: deposit * vaultPart,
        progress: 100,
      },
    ];
  }

  if (!lps.tokens) {
    return [];
  }

  const balances = lps.balances.map(parseFloat);
  const tokenAmounts = lps.tokens.map((token) =>
    !token || typeof token === 'string' || !token.price
      ? 0
      : deposit / balances.length / token.price,
  );

  // const totalValue = values.reduce((acc, value) => acc + value, 0) || 1;
  const tokens = lps.tokens.map((token, index) =>
    token && typeof token !== 'string'
      ? {
          name: token.symbol,
          amount: tokenAmounts[index] * vaultPart,
          value: (deposit / balances.length) * vaultPart,
          progress: (deposit / balances.length / deposit) * 100,
        }
      : undefined,
  );
  return tokens.filter((token) => !!token) as Row[];
};
