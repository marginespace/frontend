'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';
import AutoSizer from 'react-virtualized-auto-sizer';
import { VariableSizeList as List } from 'react-window';
import { useAccount } from 'wagmi';

import {
  useExpandedBoostedRowHeight,
  useExpandedRowHeight,
} from './useRowHeight';
import { VaultRenderer } from './vault-renderer';

import { type VaultWithApyAndTvl } from '@/actions/get-all-vaults-with-apy-and-tvl';
import { type VaultsTabValue } from '@/constants/vaults';
import { convertArrayTo2DArray } from '@/helpers/array';
import { useAdmin } from '@/hooks/useAdmin';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useMediaQuery } from '@/hooks/useMediaQuery';

export type VaultsRendererProps = {
  vaults: VaultWithApyAndTvl[];
  tab: VaultsTabValue;
  address?: string;
};

const GUTTER_SIZE = 24;
const CARD_HEIGHT = 270;
const ROW_HEIGHT = CARD_HEIGHT + GUTTER_SIZE;

export type selectedRowValue = 'open' | 'boost' | undefined;
export type selectedRow = {
  [rowIndex: number]: { [columnIndex: number]: selectedRowValue };
};

const VaultsRenderer = ({
  vaults: allVaults,
  tab,
  address,
}: VaultsRendererProps) => {
  const { address: userAddress } = useAccount();
  const router = useRouter();

  const isAdmin = useAdmin(userAddress);

  const vaults = allVaults.filter((vault) => !vault.isHidden || isAdmin);

  const [selectedRows, setSelectedRows] = useState<selectedRow>({});
  const listRef = useRef<List>(null);
  const [savedVaultsIds] = useLocalStorage<string[]>('saved-vaults', []);

  useEffect(() => {
    router.refresh();
  }, [router]);

  const isSmallDevice = useMediaQuery('(max-width: 767px)');
  const isMediumDevice = useMediaQuery(
    '(min-width: 768px) and (max-width: 1023px)',
  );

  const expandedRowHeight = useExpandedRowHeight();
  const expandedBoostedRowHeight = useExpandedBoostedRowHeight();

  const savedVaults = useMemo(
    () => vaults.filter((vault) => savedVaultsIds.includes(vault.id)),
    [vaults, savedVaultsIds],
  );

  const calcItemSize = (index: number) => {
    if (
      selectedRows[index] &&
      Object.values(selectedRows[index]).includes('boost')
    ) {
      return expandedBoostedRowHeight;
    }
    if (
      selectedRows[index] &&
      Object.values(selectedRows[index]).includes('open')
    ) {
      return expandedRowHeight;
    }
    return ROW_HEIGHT;
  };

  const handleClick = (
    rowIndex: number,
    columnIndex: number,
    value: selectedRowValue,
  ) => {
    setSelectedRows((prevRows) => {
      const newRows = JSON.parse(JSON.stringify(prevRows));

      if (!newRows[rowIndex]) {
        newRows[rowIndex] = {};
      }

      if (newRows[rowIndex][columnIndex] === value) {
        delete newRows[rowIndex][columnIndex];
      } else {
        newRows[rowIndex][columnIndex] = value;
      }

      return newRows;
    });

    listRef.current?.resetAfterIndex(rowIndex);
  };

  const itemData =
    tab === 'saved'
      ? savedVaults
      : tab === 'all'
      ? vaults
      : tab === 'my' && address
      ? vaults.filter(
          (vault) => vault.deposited > 0 && vault.status === 'active',
        )
      : [];
  const columnCount = isSmallDevice ? 1 : isMediumDevice ? 2 : 3;
  const rowCount = Math.ceil(itemData.length / columnCount);
  const vaultsRow = convertArrayTo2DArray(itemData, columnCount);

  const getMinHeight = () => {
    if (rowCount === 1) return ROW_HEIGHT;
    if (rowCount === 2) return 2 * ROW_HEIGHT;
    return 3 * ROW_HEIGHT;
  };

  return (
    <div style={{ width: '100%', height: getMinHeight() }}>
      <AutoSizer>
        {({ width, height }) => (
          <List
            className="no-scrollbar"
            ref={listRef}
            itemSize={calcItemSize}
            width={width}
            height={height}
            itemCount={rowCount}
            itemData={{
              vaults: vaultsRow,
            }}
          >
            {({ data, index, style }) => (
              <VaultRenderer
                isAdmin={isAdmin}
                data={data}
                index={index}
                style={style}
                onClick={handleClick}
                activeRow={selectedRows[index] || {}}
              />
            )}
          </List>
        )}
      </AutoSizer>
    </div>
  );
};

export default VaultsRenderer;
