'use client';

import {
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import * as React from 'react';

import { HistoryTableRow } from './table-row';

import { type VaultWithApyAndTvl } from '@/actions/get-all-vaults-with-apy-and-tvl';
import { CaretSortIcon } from '@/components/ui/icons';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { chainImages } from '@/constants/vaults';

export const columns: ColumnDef<VaultWithApyAndTvl>[] = [
  {
    accessorKey: 'name',
    header: 'Pool',
    cell: ({ row }) => <div className="capitalize">{row.getValue('name')}</div>,
  },
  {
    accessorKey: 'chain',
    header: ({ column }) => (
      <button
        className="flex items-center"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Network
        <CaretSortIcon className="fill-primary ml-2 h-4 w-4" />
      </button>
    ),
    cell: ({ row }) => (
      <div>
        {chainImages[row.getValue('chain') as string] ?? row.getValue('chain')}
      </div>
    ),
  },
  {
    accessorKey: 'deposited',
    header: ({ column }) => (
      <button
        className="flex items-center"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        AT Deposit
        <CaretSortIcon className="fill-primary ml-2 h-4 w-4" />
      </button>
    ),
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue('deposited'));

      // Format the amount as a dollar amount
      const formatted = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(amount);

      return <div>{formatted}</div>;
    },
  },
  {
    accessorKey: 'pnl',
    header: ({ column }) => (
      <button
        className="flex items-center"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        PNL
        <CaretSortIcon className="fill-primary ml-2 h-4 w-4" />
      </button>
    ),
    cell: ({ row }) => <div>{row.getValue('id')}</div>,
  },
  {
    accessorKey: 'now',
    header: ({ column }) => (
      <button
        className="flex items-center"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Now
        <CaretSortIcon className="fill-primary ml-2 h-4 w-4" />
      </button>
    ),
    cell: ({ row }) => <div>{row.getValue('id')}</div>,
  },
];

type HistoryTableProps = {
  vaults: VaultWithApyAndTvl[];
};

export function HistoryTable({ vaults }: HistoryTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );

  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});

  const table = useReactTable({
    data: vaults,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
    },
  });

  return (
    <div className="w-full">
      <div className="rounded-t-[8px] [&>div]:rounded-t-[8px]">
        <Table className="flex flex-col rounded-t-[8px]">
          <TableHeader className="border-none">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                className="grid grid-cols-7 border-none bg-[#293056] [&>th]:flex [&>th]:items-center [&>th]:text-xs [&>th]:font-semibold [&>th]:text-white"
                key={headerGroup.id}
              >
                {headerGroup.headers.map((header, i) => {
                  return (
                    <TableHead
                      key={header.id}
                      className={`${
                        i === 0 ? 'col-span-2' : ''
                      } text-[#F1F3F8]`}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody className="flex flex-col border-none">
            {table.getRowModel().rows?.length ? (
              table
                .getRowModel()
                .rows.map((row) => (
                  <HistoryTableRow key={row.id} vault={row.original} />
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
}
