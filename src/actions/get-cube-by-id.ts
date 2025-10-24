import { cache } from 'react';

import { getAllCubes } from '@/actions/get-all-cubes';
import { type FilterQuery } from '@/lib/filter-vaults';

export const getCubeById = cache(
  async (id: string, searchParams?: FilterQuery) => {
    const [cubes] = await getAllCubes(searchParams);
    return cubes.find((cube) => cube.id === id);
  },
);
