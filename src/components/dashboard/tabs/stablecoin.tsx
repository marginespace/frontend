'use client';
import groupBy from 'lodash.groupby';
import { useMemo } from 'react';

import { type ChartItem } from './chart-data';

import { type VaultWithApyAndTvl } from '@/actions/get-all-vaults-with-apy-and-tvl';
import { TooltipItem } from '@/components/tooltip-item';
import { stablecoins } from '@/constants/stablecoins';
import { capitalize } from '@/helpers/capitalize';
import { interpolateColor } from '@/helpers/interpolateColor';

export type StablecoinProps = {
  vaultsWithCubes: VaultWithApyAndTvl[];
};

export const Stablecoin = ({ vaultsWithCubes }: StablecoinProps) => {
  const data = useMemo<ChartItem[]>(() => {
    const values = vaultsWithCubes.map((vault) => vault.deposited);
    const totalAmount = values.reduce((a, b) => a + b, 0);
    const groupedByStablecoin = groupBy(vaultsWithCubes, (vault) =>
      vault.assets.some((asset) => stablecoins.includes(asset))
        ? 'Stablecoin'
        : 'Other',
    );

    const keyWithItems =
      groupedByStablecoin['Stablecoin']?.length > 0 &&
      groupedByStablecoin['Other']?.length > 0
        ? null
        : groupedByStablecoin['Stablecoin']?.length > 0
        ? 'Stablecoin'
        : groupedByStablecoin['Other']?.length > 0
        ? 'Other'
        : null;

    if (keyWithItems) {
      return [
        {
          label: keyWithItems,
          value: 1,
          percent: 100,
          color: '#A093FE',
          width: '100%',
        },
      ];
    }

    return Object.entries(groupedByStablecoin).map<ChartItem>(
      ([key, value]) => {
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
      },
    );
  }, [vaultsWithCubes]);

  return (
    <div className="flex flex-col gap-4 p-4">
      <p className="mt-4 text-sm font-medium text-text-purple">
        Displays the percentage ratio of volatile assets and stablecoins within
        the selected wallet address. Remember to have available funds for
        further use in necessary moments and particularly volatile market
        periods.
      </p>
      <div
        className="flex h-[300px] flex-col rounded-[8px] p-4
backdrop-blur-lg"
      >
        <div className="white-scrollbar flex h-[300px] flex-col gap-4 overflow-auto">
          {data.map(({ label, percent, value, color, width }) => (
            <div className="flex flex-row gap-1" key={label + value}>
              <div className="flex items-center">
                <p className="min-w-[80px] self-center whitespace-nowrap text-base font-semibold">
                  {label}
                </p>
                <TooltipItem>
                  <div className="flex max-w-[245px] flex-col gap-1">
                    <p className="text-xs font-semibold text-[#344054]">
                      What&apos;s a Stable?
                    </p>
                    <p className="text-xs font-medium text-additional-grey">
                      Tooltips are used to describe or identify an element. In
                      most scenarios, tooltips help the user understand the
                      meaning, function or alt-text of an element.
                    </p>
                  </div>
                </TooltipItem>
                <span className="self-center pl-3 text-sm font-medium">
                  {percent}%
                </span>
              </div>
              <div className="flex h-[23px] grow justify-end pr-2">
                <div
                  className="h-[23px] rounded-[3px] sm:h-full"
                  style={{ background: color, width }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
