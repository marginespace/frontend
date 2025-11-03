'use client';

import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
} from '@tanstack/react-table';
import format from 'date-fns/format';
import Link from 'next/link';
import { useState } from 'react';

import { type CubeWithApyAndTvl } from '@/actions/get-all-cubes';
import { usdFormatter } from '@/lib/usd-formatter';
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

export type EarnNestedHistoryTableProps = {
  actions: CubeWithApyAndTvl['dashboard']['vaultsMap'][string]['actions'];
};

const columns: ColumnDef<EarnNestedHistoryTableProps['actions'][number]>[] = [
  {
    accessorKey: 'action',
    header: 'Action',
    cell: ({ row }) => (
      <span className="text-[14px] font-medium">{row.original.type}</span>
    ),
  },
  {
    accessorKey: 'amount',
    header: ({ column }) => (
      <button
        className="flex items-center text-[12px] font-semibold"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Amount <CaretSortIcon className="fill-primary ml-2 h-4 w-4" />
      </button>
    ),
    cell: ({ row }) => (
      <span className="text-primary text-[14px] font-medium underline underline-offset-2">
        {usdFormatter(row.original.amount)}
      </span>
    ),
  },
  {
    accessorKey: 'balance',
    header: ({ column }) => (
      <button
        className="flex items-center text-[12px] font-semibold"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Balance <CaretSortIcon className="fill-primary ml-2 h-4 w-4" />
      </button>
    ),
    cell: ({ row }) => (
      <span className="text-[14px] font-medium underline underline-offset-2">
        {usdFormatter(row.original.balance)}
      </span>
    ),
  },
  {
    accessorKey: 'timestamp',
    header: ({ column }) => (
      <button
        className="flex items-center text-[12px] font-semibold"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Date <CaretSortIcon className="fill-primary ml-2 h-4 w-4" />
      </button>
    ),
    cell: ({ row }) => (
      <span className="text-[14px] font-medium">
        {format(new Date(row.original.timestamp), 'dd MMM yyyy HH:mm:ss')}
      </span>
    ),
  },
  {
    enableHiding: false,
    id: 'etherscanLink',
    cell: ({ row }) => {
      return (
        <Link
          className="ml-auto rounded-[8px] p-2 transition-colors hover:underline"
          target="_blank"
          href={row.original.etherscanLink}
        >
          Transaction details
        </Link>
      );
    },
  },
];

export const EarnNestedHistoryTable = ({
  actions,
}: EarnNestedHistoryTableProps) => {
  const [sorting, setSorting] = useState<SortingState>([]);

  const table = useReactTable({
    data: actions,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    state: {
      sorting,
    },
  });

  return (
    <div className="w-full rounded-md">
      <Table className="flex flex-col">
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow
              key={headerGroup.id}
              className="grid grid-cols-7 [&>th]:flex [&>th]:items-center"
            >
              {headerGroup.headers.map((header, index) => (
                <TableHead
                  key={header.id}
                  className={cn(
                    'text-xs font-medium text-white',
                    (index === 1 || index === 2) && 'col-span-2',
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
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && 'selected'}
                className="grid grid-cols-7 border-none"
              >
                {row.getVisibleCells().map((cell, index) => (
                  <TableCell
                    key={cell.id}
                    className={cn(
                      'flex items-center text-sm font-medium',
                      (index === 1 || index === 2) && 'col-span-2',
                    )}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};
