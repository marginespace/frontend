import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

import { type CubeWithApyAndTvl, getAllCubes } from '@/actions/get-all-cubes';
import { type VaultWithApyAndTvl } from '@/actions/get-all-vaults-with-apy-and-tvl';

export function useCubesAndVaults(addressFromUrl: string) {
  const [cubes, setCubes] = useState<CubeWithApyAndTvl[]>([]);
  const [vaults, setVaults] = useState<VaultWithApyAndTvl[]>([]);

  const { data, isLoading } = useQuery({
    queryKey: [`cubes-${addressFromUrl}`],
    queryFn: () => getAllCubes({ address: addressFromUrl }),
  });

  useEffect(() => {
    if (!data) return;

    const [fetchedCubes, fetchedVaultsFromCubes] = data;
    setCubes(fetchedCubes);
    setVaults(fetchedVaultsFromCubes.filter((vault) => vault.deposited > 0));
  }, [data]);

  const usedBefore = vaults.length > 0 || cubes.length > 0;

  return { cubes, vaults, usedBefore, isLoading };
}
