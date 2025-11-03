'use client';
import groupBy from 'lodash.groupby';
import { memo, useMemo } from 'react';

import { type ChartItem } from './chart-data';

import { type VaultWithApyAndTvl } from '@/actions/get-all-vaults-with-apy-and-tvl';
import { capitalize } from '@/helpers/capitalize';
import { interpolateColor } from '@/helpers/interpolateColor';
import { useMediaQuery } from '@/hooks/useMediaQuery';

export type PlatformProps = {
  vaultsWithCubes: VaultWithApyAndTvl[];
};

export const Platform = memo(({ vaultsWithCubes }: PlatformProps) => {
  const isLargeDevice = useMediaQuery('(min-width: 1280px)');

  const data = useMemo<ChartItem[]>(() => {
    if (vaultsWithCubes.length === 1) {
      return [
        {
          label: capitalize(vaultsWithCubes[0].platformId),
          value: vaultsWithCubes[0].deposited,
          percent: 100,
          color: '#A093FE',
          width: '100%',
        },
      ];
    }

    const values = vaultsWithCubes.map((vault) => vault.deposited);
    const totalAmount = values.reduce((a, b) => a + b, 0);
    const groupedByPlatform = groupBy(
      vaultsWithCubes,
      (vault) => vault.platformId,
    );

    return Object.entries(groupedByPlatform).map<ChartItem>(([key, value]) => {
      const chainAmount = value.reduce(
        (sum, vault) => vault.deposited + sum,
        0,
      );
      const percentage = (chainAmount / totalAmount) * 100;
      let parsedPercentage: number;

      if (percentage % 1 === 0) {
        parsedPercentage = percentage;
      } else {
        parsedPercentage = Number(percentage.toFixed(2));
      }

      const maxVal = Math.max(...values);
      const minVal = Math.min(...values);

      return {
        label: capitalize(key),
        value: chainAmount,
        percent: parsedPercentage,
        color: interpolateColor(
          chainAmount,
          minVal,
          maxVal,
          '#ffffff',
          '#A093FE',
        ),
        width: `${parsedPercentage}%`,
      };
    });
  }, [vaultsWithCubes]);

  return (
    <div className="flex flex-col gap-4 p-4">
      <p className="mt-4 text-sm font-medium text-text-purple">
        Shows in which platforms and in what quantity the assets of the selected
        wallet address are located. Don&apos;t forget to stay informed about the
        news and updates of these platforms and diversify your risks by using
        different platforms.
      </p>
      <div className="white-scrollbar flex h-[300px] flex-col gap-4 overflow-auto pr-4">
        {data.map(({ label, percent, value, color, width }) => (
          <div
            className="flex flex-col gap-2 xl:flex-row xl:items-center"
            key={label + value}
          >
            {isLargeDevice ? (
              <>
                <p className="min-w-[80px] self-center whitespace-nowrap text-base font-semibold md:col-span-3 lg:col-span-2">
                  {label}
                </p>
                <span className="shrink-0 self-center pl-2 text-sm font-medium">
                  {percent}%
                </span>
                <div className="flex h-[20px] grow xl:justify-end">
                  <div
                    className="h-full w-full rounded-[3px]"
                    style={{ background: color, width }}
                  />
                </div>
              </>
            ) : (
              <>
                <div className="flex">
                  <p className="min-w-[80px] self-center whitespace-nowrap text-base font-semibold md:col-span-3 lg:col-span-2">
                    {label}
                  </p>
                  <span className="shrink-0 self-center pl-2 text-sm font-medium">
                    {percent}%
                  </span>
                </div>
                <div className="flex h-[20px] grow xl:justify-end">
                  <div
                    className="h-full w-full rounded-[3px]"
                    style={{ background: color, width }}
                  />
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
});
Platform.displayName = 'Platform';
