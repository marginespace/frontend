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
    if (!data.cubes) return null;

    return (
      <div
        className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        style={style}
      >
        {data.cubes[index].map((cube, columnIndex) => (
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
