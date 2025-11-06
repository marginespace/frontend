'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';
import AutoSizer from 'react-virtualized-auto-sizer';
import { VariableSizeList as List } from 'react-window';

import { CubeRenderer } from './cube-renderer';
import {
  useExpandedBoostedRowHeight,
  useExpandedRowHeight,
} from './useRowHeight';

import { type CubeWithApyAndTvl } from '@/actions/get-all-cubes';
import { type CubesTabValue } from '@/constants/cubes';
import { convertArrayTo2DArray } from '@/helpers/array';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useMediaQuery } from '@/hooks/useMediaQuery';

export type CubesRendererProps = {
  cubes: CubeWithApyAndTvl[];
  tab: CubesTabValue;
  address?: string;
};

const GUTTER_SIZE = 24;
const CARD_HEIGHT = 202;
const ROW_HEIGHT = CARD_HEIGHT + GUTTER_SIZE;
const ROW_HEIGHT_EXPANDED = 300 + GUTTER_SIZE;

export type selectedRowValue = 'open' | 'boost' | undefined;
export type selectedRow = {
  [rowIndex: number]: { [columnIndex: number]: selectedRowValue };
};

const CubesRenderer = ({ cubes, tab, address }: CubesRendererProps) => {
  const [selectedRows, setSelectedRows] = useState<selectedRow>({});
  const listRef = useRef<List>(null);
  const [savedCubesIds] = useLocalStorage<string[]>('saved-cubes', []);
  const router = useRouter();

  useEffect(() => {
    router.refresh();
  }, [router]);


  const isSmallDevice = useMediaQuery('(max-width: 767px)');
  const isMediumDevice = useMediaQuery(
    '(min-width: 768px) and (max-width: 1023px)',
  );
  const isLargeDevice = useMediaQuery(
    '(min-width: 1024px) and (max-width: 1279px)',
  );

  const expandedRowHeight = useExpandedRowHeight();
  const expandedBoostedRowHeight = useExpandedBoostedRowHeight();

  const savedCubes = useMemo(
    () => cubes.filter((cube) => savedCubesIds.includes(cube.id)),
    [cubes, savedCubesIds],
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
    const isOpening = !selectedRows[rowIndex]?.[columnIndex] && value;
    
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
    
    // Автоматическая прокрутка к раскрытой карточке
    if (isOpening && listRef.current) {
      setTimeout(() => {
        listRef.current?.scrollToItem(rowIndex, 'smart');
      }, 100);
    }
  };

  const itemData =
    tab === 'saved'
      ? savedCubes
      : tab === 'all'
      ? cubes
      : tab === 'my' && address
      ? cubes
      : [];
  

  const columnCount = isSmallDevice
    ? 1
    : isMediumDevice
    ? 2
    : isLargeDevice
    ? 3
    : 4;
  const rowCount = Math.ceil(itemData.length / columnCount);
  const cubesRow = convertArrayTo2DArray(itemData, columnCount);

  const getMinHeight = () => {
    if (rowCount === 1) return ROW_HEIGHT_EXPANDED;
    if (rowCount === 2) return 2 * ROW_HEIGHT_EXPANDED;
    return 2 * ROW_HEIGHT_EXPANDED;
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
              cubes: cubesRow,
            }}
          >
            {({ data, index, style }) => (
              <CubeRenderer
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

export default CubesRenderer;
