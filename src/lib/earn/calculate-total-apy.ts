import { type Apy } from '@/actions/get-all-apys';

export const calculateTotalApy = (vaults: { apy?: Apy; part: number }[]) => {
  if (vaults.length === 0) {
    return 0;
  }
  return vaults.reduce(
    (acc, { apy, part }) => acc + ((apy?.totalApy ?? 0) * part) / 100,
    0,
  );
};
