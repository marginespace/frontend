'use client';

import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
} from '@tanstack/react-table';
import { useState } from 'react';

import { type CubeWithApyAndTvl } from '@/actions/get-all-cubes';
import { EarnHistoryTableRow } from '@/components/dashboard/earn-history-table/table-row';
import { cn } from '@/lib/utils';
import { CaretSortIcon } from '@/ui/icons';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/ui/table';

export type EarnHistoryTableProps = {
  cubes: CubeWithApyAndTvl[];
};

const columns: ColumnDef<CubeWithApyAndTvl>[] = [
  {
    accessorKey: 'name',
    header: 'Cube',
  },
  {
    id: 'vaults',
    enableHiding: false,
  },
  {
    accessorKey: 'network',
    header: ({ column }) => (
      <button
        className="flex items-center"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Network
        <CaretSortIcon className="fill-primary ml-2 h-4 w-4" />
      </button>
    ),
  },
  {
    id: 'AT Deposit',
    accessorFn: (cube) => cube.dashboard.atDeposit,
    header: ({ column }) => (
      <button
        className="flex items-center"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        AT Deposit
        <CaretSortIcon className="fill-primary ml-2 h-4 w-4" />
      </button>
    ),
  },
  {
    id: 'PNL',
    accessorFn: (cube) => cube.dashboard.pnl,
    header: ({ column }) => (
      <button
        className="flex items-center"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        PNL
        <CaretSortIcon className="fill-primary ml-2 h-4 w-4" />
      </button>
    ),
  },
  {
    id: 'Now',
    accessorFn: (cube) => cube.dashboard.pnl,
    header: ({ column }) => (
      <button
        className="flex items-center"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Now
        <CaretSortIcon className="fill-primary ml-2 h-4 w-4" />
      </button>
    ),
  },
  {
    id: 'Stop/Loss',
    accessorFn: (cube) => cube.dashboard.pnl,
    header: ({ column }) => (
      <button
        className="flex items-center"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Stop/Loss
        <CaretSortIcon className="fill-primary ml-2 h-4 w-4" />
      </button>
    ),
  },
  {
    enableHiding: false,
    id: 'etherscanUrl',
  },
];

export const EarnHistoryTable = ({ cubes }: EarnHistoryTableProps) => {
  const [sorting, setSorting] = useState<SortingState>([]);

  const table = useReactTable({
    data: cubes,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    state: {
      sorting,
    },
  });

  return (
    <div className="w-full">
      <div className="rounded-t-[8px] [&>div]:rounded-t-[8px]">
        <Table className="flex flex-col rounded-t-[8px]">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                className="grid grid-cols-9 bg-[#293056] text-[12px] [&>th]:flex [&>th]:items-center [&>th]:text-xs [&>th]:font-semibold [&>th]:text-white"
              >
                {headerGroup.headers.map((header, index) => (
                  <TableHead
                    key={header.id}
                    className={cn(
                      'text-[#F1F3F8]',
                      index === 0 && 'col-span-2',
                    )}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody className="flex flex-col">
            {table.getRowModel().rows?.length ? (
              table
                .getRowModel()
                .rows.map((row) => (
                  <EarnHistoryTableRow key={row.id} cube={row.original} />
                ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
