'use client';

import Image from 'next/image';
import { Fragment, useCallback, useMemo, useState } from 'react';

import { type CubeWithApyAndTvl } from '@/actions/get-all-cubes';
import {
  AccordionButton,
  Divider,
} from '@/components/earn/earn-details/common/Divider';
import { LpTable } from '@/components/earn/earn-details/lp-breakdown/lp-table';
import { getTokenAssetUrl } from '@/constants/assets';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { getRowsUserFromLps } from '@/lib/get-rows-from-user-lp';
import { tvlFormatter } from '@/lib/tvl-formatter';

export type DistributionProps = {
  cube: CubeWithApyAndTvl;
  deposit: number;
};

const DISTRIBUTION_DECIMALS = 5;

export const Distribution = ({ cube, deposit }: DistributionProps) => {
  const isMobile = useMediaQuery('(max-width: 576px)');

  const [opened, setOpened] = useState(true);
  const assetMatrix = useMemo(
    () =>
      cube.vaults.map((vault) => ({
        vault: vault.name,
        platform: vault.platformId,
        distribution: vault.part,
        rows: getRowsUserFromLps(vault, cube, deposit),
      })),
    [cube, deposit],
  );

  const [totalDistribution, totalValue] = useMemo(() => {
    let totalValue = 0;
    return [
      assetMatrix?.reduce(
        (acc, asset) => {
          asset.rows.forEach((row) => {
            if (!acc[row.name]) {
              acc[row.name] = {
                amount: 0,
                value: 0,
              };
            }
            acc[row.name].amount += row.amount;
            totalValue += row.value;
            acc[row.name].value += row.value;
          });
          return acc;
        },
        {} as Record<string, { amount: number; value: number }>,
      ),
      totalValue,
    ] as const;
  }, [assetMatrix]);

  const MoreDetails = useCallback(
    ({ asset }: { asset: (typeof assetMatrix)[number] }) => (
      <div className="flex flex-col gap-[10px]">
        <div className="flex flex-col items-start justify-between gap-[10px] px-0 md:flex-row md:items-center md:gap-0 md:px-[16px]">
          <div className="flex items-center gap-[4px]">
            {asset.rows.map(({ name }) => (
              <Image
                key={name}
                width={16}
                height={16}
                src={getTokenAssetUrl(name)}
                alt={name}
              />
            ))}
            <div className="text-[14px] font-semibold text-white">
              {asset.vault}
            </div>
          </div>
          {!isMobile && (
            <>
              <div className="flex items-center gap-[8px]">
                <div className="text-[12px] font-[500] text-text-purple">
                  Platform
                </div>
                <div className="w-[70px] text-end text-[12px] font-[500] text-white">
                  {asset.platform}
                </div>
              </div>
              <div className="flex items-center gap-[8px]">
                <div className="text-[12px] font-[500] text-text-purple">
                  Distribution
                </div>
                <div className="w-[70px] text-end text-[12px] font-[500] text-white">
                  {asset.distribution}%
                </div>
              </div>
            </>
          )}
          {isMobile && (
            <div className="flex w-full items-center justify-between gap-[10px] px-[16px]">
              <div className="flex items-center gap-[8px]">
                <div className="text-[12px] font-[500] text-text-purple">
                  Platform
                </div>
                <div className=" text-end text-[12px] font-[500] text-white">
                  {asset.platform}
                </div>
              </div>
              <div className="flex items-center gap-[8px]">
                <div className="text-[12px] font-[500] text-text-purple">
                  Distribution
                </div>
                <div className=" text-end text-[12px] font-[500] text-white">
                  {asset.distribution}%
                </div>
              </div>
            </div>
          )}
        </div>
        <LpTable
          data={asset.rows.map((row) => ({
            name: row.name,
            value: tvlFormatter(row.value, DISTRIBUTION_DECIMALS),
            amount: row.amount.toFixed(DISTRIBUTION_DECIMALS),
            percent: row.progress,
          }))}
          needLight
        />
      </div>
    ),
    [isMobile],
  );

  return (
    <div className="flex flex-col gap-[8px] rounded-[12px] rounded-tl-none p-4 pt-8">
      <div className="flex items-center justify-between rounded-[8px] bg-transparent-bg px-4 py-[3px]">
        <div className="text-[16px] font-semibold leading-6 text-text-purple">
          Estimated Distribution
        </div>
        <div className="text-text-white text-[16px] font-semibold leading-6">
          100%
        </div>
      </div>
      <LpTable
        data={Object.entries(totalDistribution).map(
          ([name, { amount, value }]) => ({
            name,
            amount: amount.toFixed(DISTRIBUTION_DECIMALS),
            value: tvlFormatter(value, DISTRIBUTION_DECIMALS),
            percent: (value / totalValue) * 100,
          }),
        )}
      />
      <AccordionButton
        opened={opened}
        onClick={() => setOpened((prev) => !prev)}
      />
      {opened && (
        <div className="flex flex-col gap-[24px] md:gap-[12px]">
          {assetMatrix.map((asset, index) => (
            <Fragment key={asset.vault}>
              <MoreDetails asset={asset} />
              {index !== assetMatrix.length - 1 && <Divider />}
            </Fragment>
          ))}
        </div>
      )}
    </div>
  );
};
