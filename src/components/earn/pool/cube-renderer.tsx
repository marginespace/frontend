'use client';

import { memo } from 'react';
import { areEqual, type ListChildComponentProps } from 'react-window';

import { type selectedRowValue } from '.';

import { type CubeWithApyAndTvl } from '@/actions/get-all-cubes';
import { EarnPoolCard } from '@/components/pools/earn-pool-card';

export type CubesRendererProps = {
  cubes: CubeWithApyAndTvl[][];
};

export type CubeRendererProps = ListChildComponentProps<CubesRendererProps> & {
  activeRow: { [columnIndex: number]: selectedRowValue };
  onClick: (
    rowIndex: number,
    columnIndex: number,
    value?: 'open' | 'boost',
  ) => void;
};

export const CubeRenderer = memo(
  ({ data, style, index, onClick, activeRow }: CubeRendererProps) => {
    if (!data.cubes || !Array.isArray(data.cubes)) return null;
    
    // Protect against undefined row
    const rowCubes = data.cubes[index];
    if (!rowCubes || !Array.isArray(rowCubes)) return null;

    return (
      <div
        className="grid grid-cols-1 gap-4 px-2 sm:grid-cols-1 sm:gap-6 sm:px-4 md:grid-cols-2 md:gap-6 lg:grid-cols-3 lg:gap-8 xl:grid-cols-4 xl:gap-8 2xl:grid-cols-4 2xl:gap-8 grid-auto-fit-strategies"
        style={style}
      >
        {rowCubes.map((cube, columnIndex) => (
          <EarnPoolCard
            key={cube.id}
            cube={cube}
            rowIndex={index}
            columnIndex={columnIndex}
            onClick={onClick}
            open={activeRow[columnIndex]}
          />
        ))}
      </div>
    );
  },
  areEqual,
);
CubeRenderer.displayName = 'CubesRerender';
