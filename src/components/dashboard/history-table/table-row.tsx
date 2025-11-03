import Image from 'next/image';
import Link from 'next/link';
import { type MouseEvent, useCallback, useState } from 'react';
import { formatUnits } from 'viem';

import NestedHistoryTable from './nested-table';

import { type VaultWithApyAndTvl } from '@/actions/get-all-vaults-with-apy-and-tvl';
import { Button } from '@/components/ui/button';
import { AccordionArrowSVG } from '@/components/ui/icons/accordion-arrow';
import { TableCell, TableRow } from '@/components/ui/table';
import { getTokenAssetUrl } from '@/constants/assets';
import { chainImages } from '@/constants/vaults';
import { capitalize } from '@/helpers/capitalize';
import { cn } from '@/lib/utils';

type HistoryTableRowProps = {
  vault: VaultWithApyAndTvl;
};

export const HistoryTableRow = ({ vault }: HistoryTableRowProps) => {
  const [open, setOpen] = useState<boolean>(false);

  const price = vault.lps?.price ?? 0;
  const decimals = vault.dashboard.decimals;
  const deposit = parseFloat(
    formatUnits(BigInt(vault.dashboard.depositedInRaw), decimals),
  );
  const shares = parseFloat(formatUnits(BigInt(vault.dashboard.shares), 18));
  const now = deposit * shares;
  const pnl = now - deposit;

  const handleRowClick = useCallback(
    (e: MouseEvent<HTMLButtonElement | HTMLDivElement>) => {
      e.stopPropagation();
      setOpen((open) => !open);
    },
    [],
  );

  return (
    <>
      <TableRow
        onClick={handleRowClick}
        className={cn(
          'grid cursor-pointer grid-cols-7 items-center border-none',
          open ? '!bg-[rgba(53,40,82,0.43)]' : '',
        )}
      >
        <TableCell className="col-span-2 flex flex-col">
          <div className="flex gap-2">
            <div className="flex items-center gap-1 lg:justify-center">
              {vault.assets.map((asset) => (
                <Image
                  key={asset}
                  width={16}
                  height={16}
                  src={getTokenAssetUrl(asset)}
                  alt={asset}
                />
              ))}
            </div>
            <span className="text-sm font-semibold">{vault.name}</span>
          </div>
          {open && (
            <span className="text-sm font-semibold text-light-grey">
              Platform:{' '}
              <span className="text-base font-semibold text-white">
                {vault.platformId.toUpperCase()}
              </span>
            </span>
          )}
        </TableCell>
        <TableCell>
          <div className="flex w-fit items-center gap-[6px] rounded-[4px] bg-white bg-opacity-[0.11] px-[8px] py-[2px] font-medium">
            {chainImages[vault.chain] ?? null}
            <div>{capitalize(vault.chain)}</div>
          </div>
        </TableCell>
        <TableCell>
          <div className="text-[14px] font-medium">{deposit.toFixed(8)}</div>
          <div className="text-[12px] font-semibold">
            ${(deposit * price).toFixed(2)}
          </div>
        </TableCell>
        <TableCell>
          <div className="text-[14px] font-medium">{pnl.toFixed(8)}</div>
          <div className="text-[12px] font-semibold">
            ${(pnl * price).toFixed(2)}
          </div>
        </TableCell>
        <TableCell>
          <div className="text-[14px] font-medium">{now.toFixed(8)}</div>
          <div className="text-[12px] font-semibold">
            ${(now * price).toFixed(2)}
          </div>
        </TableCell>
        <TableCell className="flex items-center justify-end gap-6">
          {!vault.isArchived && (
            <Link
              className="bg-primary hover:bg-primary-hover ml-auto rounded-[8px] px-2 py-1 text-center text-xs font-medium text-white transition-colors"
              target="_blank"
              href={`/vault/${vault.oracleId}`}
            >
              Go to vault
            </Link>
          )}
          <Button
            onClick={handleRowClick}
            className="h-fit bg-transparent p-0 transition-all"
          >
            <AccordionArrowSVG
              className={cn(
                'h-5 w-5 shrink-0 cursor-pointer transition-all',
                open ? 'rotate-0' : 'rotate-180',
              )}
            />
          </Button>
        </TableCell>
      </TableRow>
      <TableRow
        className={cn(
          'flex border-spacing-4 border-b-2 border-dashed border-light-grey',
        )}
      >
        <TableCell className="w-full p-0">
          <NestedHistoryTable open={open} vault={vault} />
        </TableCell>
      </TableRow>
    </>
  );
};
