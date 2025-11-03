'use client';

import {
  type ColumnDef,
  type SortingState,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import format from 'date-fns/format';
import Link from 'next/link';
import { memo, useMemo, useState } from 'react';
import { formatUnits } from 'viem';
import { useConfig } from 'wagmi';

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
import { getTransactionUrl } from '@/helpers/getTransactionUrl';
import { cn } from '@/lib/utils';

export const columns: ColumnDef<
  VaultWithApyAndTvl['dashboard']['actions'][number] & {
    etherscanUrl: string;
    price?: number;
    decimals: number;
  }
>[] = [
  {
    accessorKey: 'action',
    header: 'Action',
    cell: ({ row }) => <div className="capitalize">{row.original.action}</div>,
  },
  {
    accessorKey: 'amount',
    header: ({ column }) => {
      return (
        <button
          className="flex items-center"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Amount
          <CaretSortIcon className="fill-primary ml-2 h-4 w-4" />
        </button>
      );
    },
    cell: ({ row }) => {
      const price = row.original.price ?? 0;
      const formattedAmount = +formatUnits(
        BigInt(row.original.amount),
        row.original.decimals,
      );

      return (
        <div className="underline-offset-3 text-primary underline">
          ${(price * formattedAmount).toFixed(2)}
        </div>
      );
    },
  },
  {
    accessorKey: 'balance',
    header: ({ column }) => {
      return (
        <button
          className="flex items-center"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Balance
          <CaretSortIcon className="fill-primary ml-2 h-4 w-4" />
        </button>
      );
    },
    cell: ({ row }) => {
      const price = row.original.price ?? 0;
      const formattedAmount = +formatUnits(
        BigInt(row.original.balance),
        row.original.decimals,
      );

      return (
        <div className="lowercase">${(price * formattedAmount).toFixed(2)}</div>
      );
    },
  },
  {
    accessorKey: 'timestamp',
    header: ({ column }) => {
      return (
        <button
          className="flex items-center"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Date
          <CaretSortIcon className="fill-primary ml-2 h-4 w-4" />
        </button>
      );
    },
    cell: ({ row }) => (
      <div>
        {format(
          new Date(+row.original.timestamp * 1000),
          'dd MMM yyyy HH:mm:ss',
        )}
      </div>
    ),
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => {
      return (
        <Link
          className="ml-auto rounded-[8px] p-2 transition-colors hover:underline"
          target="_blank"
          href={row.original.etherscanUrl}
        >
          Transaction details
        </Link>
      );
    },
  },
];

export type NestedHistoryTableProps = {
  vault: VaultWithApyAndTvl;
  open: boolean;
};

function NestedHistoryTable({ vault, open }: NestedHistoryTableProps) {
  const { publicClient } = useConfig();

  const [sorting, setSorting] = useState<SortingState>([]);

  const etherscanUrl = useMemo(
    () =>
      publicClient.chain.blockExplorers?.default.url || 'https://etherscan.io',
    [publicClient],
  );

  const preparedData = useMemo(() => {
    return vault.dashboard.actions.map((action) => ({
      ...action,
      decimals: vault.dashboard.decimals,
      price: vault.lps?.price,
      etherscanUrl: getTransactionUrl(etherscanUrl, action.transactionHash),
    }));
  }, [vault, etherscanUrl]);

  const table = useReactTable({
    data: preparedData,
    columns,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
  });

  return (
    <div className="w-full rounded-md">
      <Table className={cn('flex flex-col', open ? 'h-full' : 'h-0')}>
        <TableHeader className="border-none">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow
              className="grid grid-cols-7 border-none [&>th]:flex [&>th]:items-center"
              key={headerGroup.id}
            >
              {headerGroup.headers.map((header, i) => {
                return (
                  <TableHead
                    key={header.id}
                    className={`${
                      i === 2 || i === 4 ? 'col-span-2' : ''
                    } text-xs font-medium text-white`}
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
        <TableBody className="border-none">
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && 'selected'}
                className="grid grid-cols-7 border-none"
              >
                {row.getVisibleCells().map((cell, i) => (
                  <TableCell
                    className={`${
                      i === 2
                        ? 'col-span-2'
                        : i === 4
                        ? 'col-span-2 flex justify-end'
                        : ''
                    } flex items-center text-sm font-medium`}
                    key={cell.id}
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
}

export default memo(NestedHistoryTable);
