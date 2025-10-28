import Image from 'next/image';
import Link from 'next/link';
import { type MouseEvent, useCallback, useState } from 'react';

import { type CubeWithApyAndTvl } from '@/actions/get-all-cubes';
import { EarnNestedHistoryTable } from '@/components/dashboard/earn-history-table/earn-nested-table';
import { Button } from '@/components/ui/button';
import { AccordionArrowSVG } from '@/components/ui/icons/accordion-arrow';
import { getTokenAssetUrl } from '@/constants/assets';
import { usdFormatter } from '@/lib/usd-formatter';
import { cn } from '@/lib/utils';
import { TableCell, TableRow } from '@/ui/table';

type EarnVaultTableRowProps = {
  vault: CubeWithApyAndTvl['vaults'][number];
  vaultsMap: CubeWithApyAndTvl['dashboard']['vaultsMap'];
};

export const EarnVaultTableRow = ({
  vault,
  vaultsMap,
}: EarnVaultTableRowProps) => {
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
        className="grid cursor-pointer grid-cols-9 items-center border-none"
      >
        <TableCell className="col-span-4 flex flex-col">
          <span className="flex gap-2">
            <span className="flex items-center gap-1 lg:justify-center">
              {vault.assets.map((asset) => (
                <Image
                  key={asset}
                  width={16}
                  height={16}
                  src={getTokenAssetUrl(asset)}
                  alt={asset}
                />
              ))}
            </span>
            <span className="text-[14px] font-semibold">{vault.name}</span>
          </span>
          <span className="flex items-center gap-[4px] text-[14px] font-semibold text-[#C6C6CC]">
            Platform:
            <span className="text-[12px] text-[#C6C6CC]">
              {vault.platformId.toUpperCase()}
            </span>
          </span>
        </TableCell>
        <TableCell>
          <span className="text-[14px] font-medium">
            {usdFormatter(vaultsMap[vault.id].atDeposit)}
          </span>
        </TableCell>
        <TableCell className="flex flex-col">
          <span className="text-[14px] font-medium">
            {usdFormatter(vaultsMap[vault.id].pnl)}
          </span>
        </TableCell>
        <TableCell>
          <span className="text-[14px] font-medium">
            {usdFormatter(vaultsMap[vault.id].now)}
          </span>
        </TableCell>
        <TableCell className="col-span-2 flex items-center justify-end gap-6">
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
      {open && (
        <TableRow className="flex border-spacing-4 border-none">
          <EarnNestedHistoryTable actions={vaultsMap[vault.id].actions} />
        </TableRow>
      )}
    </>
  );
};
