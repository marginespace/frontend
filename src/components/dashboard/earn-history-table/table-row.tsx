import Image from 'next/image';
import Link from 'next/link';
import { type MouseEvent, useCallback, useState } from 'react';

import { type CubeWithApyAndTvl } from '@/actions/get-all-cubes';
import { EarnVaultTableRow } from '@/components/dashboard/earn-history-table/vault-table-row';
import { Button } from '@/components/ui/button';
import { AccordionArrowSVG } from '@/components/ui/icons/accordion-arrow';
import { getTokenAssetUrl } from '@/constants/assets';
import { chainImages } from '@/constants/vaults';
import { capitalize } from '@/helpers/capitalize';
import { usdFormatter } from '@/lib/usd-formatter';
import { cn } from '@/lib/utils';
import { TableCell, TableRow } from '@/ui/table';

type EarnHistoryTableRowProps = {
  cube: CubeWithApyAndTvl;
};

export const EarnHistoryTableRow = ({ cube }: EarnHistoryTableRowProps) => {
  const [open, setOpen] = useState<boolean>(false);

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
          'grid cursor-pointer grid-cols-9 items-center',
          open
            ? 'border-none !bg-[rgba(53,40,82,0.43)]'
            : 'border-b-2 border-dashed border-light-grey',
        )}
      >
        <TableCell className="col-span-2">
          <div className="flex items-center gap-2">
            <Image
              src={getTokenAssetUrl(cube.stable)}
              alt={cube.stable}
              width={16}
              height={16}
            />
            <span className="text-xs font-semibold sm:text-sm lg:text-base">
              {cube.name}
            </span>
          </div>
        </TableCell>
        <TableCell className="text-center">
          <span className="text-[14px] font-semibold text-[#C6C6C6]">
            Vaults: <span className="text-white">{cube.vaults.length}</span>
          </span>
        </TableCell>
        <TableCell>
          <div className="flex w-fit items-center gap-[6px] rounded-[4px] bg-white bg-opacity-[0.11] px-[8px] py-[2px] font-medium">
            {chainImages[cube.network] ?? null}
            <div>{capitalize(cube.network)}</div>
          </div>
        </TableCell>
        <TableCell>
          <div className="text-[14px] font-medium">
            {usdFormatter(cube.dashboard.atDeposit)}
          </div>
        </TableCell>
        <TableCell>
          <div className="text-[14px] font-medium">
            {usdFormatter(cube.dashboard.pnl)}
          </div>
        </TableCell>
        <TableCell>
          <div className="text-[14px] font-medium">
            {usdFormatter(cube.dashboard.now)}
          </div>
        </TableCell>
        <TableCell>
          <div className="text-[14px] font-medium">
            {usdFormatter(cube.dashboard.stopLoss)}
          </div>
          <div className="text-[12px] font-semibold text-[#C6C6CC]">
            Risk:{' '}
            <span
              className={
                cube.dashboard.stopLossPercent <= 10
                  ? 'text-[#59B38A]'
                  : cube.dashboard.stopLossPercent <= 25
                  ? 'text-[#E9C268]'
                  : 'text-[#D85F5A]'
              }
            >
              {cube.dashboard.stopLossPercent === cube.stopLosses?.[0]
                ? 'Low'
                : cube.dashboard.stopLossPercent === cube.stopLosses?.[1]
                ? 'Medium'
                : 'High'}{' '}
              {cube.dashboard.stopLossPercent}%
            </span>
          </div>
        </TableCell>
        <TableCell className="flex items-center justify-end gap-2">
          <Link
            className="bg-primary hover:bg-primary-hover ml-auto rounded-[8px] px-2 py-1 text-center text-xs font-medium text-white transition-colors"
            target="_blank"
            href={`/earn/${cube.id}`}
          >
            Go to cube
          </Link>
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
      {open && (
        <TableRow className="flex border-spacing-4 border-b-2 border-dashed border-light-grey">
          <TableCell className="w-full border-none p-0">
            {cube.vaults.map((vault) => (
              <EarnVaultTableRow
                key={`${cube.id}-${vault.id}`}
                vault={vault}
                vaultsMap={cube.dashboard.vaultsMap}
              />
            ))}
          </TableCell>
        </TableRow>
      )}
    </>
  );
};
