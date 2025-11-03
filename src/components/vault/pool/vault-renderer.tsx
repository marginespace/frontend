'use client';

import { memo } from 'react';
import { areEqual, type ListChildComponentProps } from 'react-window';

import { type selectedRowValue } from '.';

import { type VaultWithApyAndTvl } from '@/actions/get-all-vaults-with-apy-and-tvl';
import { AllPoolCard } from '@/components/pools/all-pools-card';

export type VaultsRendererProps = {
  vaults: VaultWithApyAndTvl[][];
};

export type VaultRendererProps =
  ListChildComponentProps<VaultsRendererProps> & {
    activeRow: { [columnIndex: number]: selectedRowValue };
    onClick: (
      rowIndex: number,
      columnIndex: number,
      value?: 'open' | 'boost',
    ) => void;
    isAdmin: boolean;
  };

export const VaultRenderer = memo(
  ({ data, style, index, onClick, activeRow, isAdmin }: VaultRendererProps) => {
    if (!data.vaults) return null;

    return (
      <div
        className="grid grid-cols-1 gap-4 px-2 sm:grid-cols-1 sm:gap-6 sm:px-4 md:grid-cols-2 md:gap-6 lg:grid-cols-3 lg:gap-8 xl:grid-cols-3 xl:gap-8 xl:justify-items-center 2xl:grid-cols-4 2xl:gap-8 2xl:justify-items-center"
        style={style}
      >
        {data.vaults[index].map((vault, columnIndex) => (
          <AllPoolCard
            isAdmin={isAdmin}
            key={vault.id}
            vault={vault}
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
VaultRenderer.displayName = 'VaultRenderer';
