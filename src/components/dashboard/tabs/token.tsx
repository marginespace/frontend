'use client';

import { useMemo } from 'react';
import { Cell, Pie, PieChart } from 'recharts';

import { type ChartItem } from './chart-data';

import { type VaultWithApyAndTvl } from '@/actions/get-all-vaults-with-apy-and-tvl';
import { groupVaultsByAsset } from '@/helpers/groupVaultsByAsset';
import { hashColor } from '@/helpers/hashColor';
import { useMediaQuery } from '@/hooks/useMediaQuery';

export type TokenType = {
  vaultsWithCubes: VaultWithApyAndTvl[];
};

export const Token = ({ vaultsWithCubes }: TokenType) => {
  const isSmallDevice = useMediaQuery('(max-width: 767px)');
  const isLargeDevice = useMediaQuery(
    '(min-width: 1280px) and (max-width: 1535px)',
  );
  const data = useMemo<ChartItem[]>(() => {
    const { totalAmount, groupedByAsset } = groupVaultsByAsset(vaultsWithCubes);
    return Object.entries(groupedByAsset).map<ChartItem>(([key, value]) => {
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

      return {
        label: key,
        value: chainAmount,
        percent: parsedPercentage,
        color: hashColor(key, chainAmount),
      };
    });
  }, [vaultsWithCubes]);

  return (
    <div className="flex flex-col gap-4 p-4">
      <p className="mt-4 text-sm font-medium text-text-purple">
        Indicates in which tokens and in what quantity the assets of the
        selected wallet address are located. Remember to stay informed about the
        news and updates of these products and diversify your risks by holding
        various assets in your portfolio.
      </p>
      <div className="flex flex-col items-center justify-start gap-4 lg:grid lg:grid-cols-2 lg:p-6">
        <div className="flex items-center">
          <PieChart
            width={isSmallDevice ? 150 : isLargeDevice ? 280 : 340}
            height={isSmallDevice ? 150 : 280}
          >
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={isSmallDevice ? 50 : 100}
              outerRadius={isSmallDevice ? 75 : 140}
              paddingAngle={2}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell
                  stroke="transparent"
                  key={`cell-${index}`}
                  fill={data[index].color}
                />
              ))}
            </Pie>
          </PieChart>
        </div>
        <div className="white-scrollbar grid max-h-[220px] grid-cols-1 items-center gap-2 overflow-auto pr-2 2xl:grid-cols-2">
          {data.map(({ label, color, percent }) => (
            <div
              key={label}
              className="col-span-1 flex w-[320px] max-w-[320px] items-center justify-between rounded-[16px] border-none bg-white bg-opacity-11 px-3 py-2 backdrop-blur-2lg lg:w-[100%]"
            >
              <div className="col-span-1 flex items-center">
                <div
                  className="mr-2 h-2 w-2 rounded-full"
                  style={{ background: color }}
                />
                <p className="text-sm font-semibold">{label}</p>
              </div>
              <p className="text-sm font-medium">{percent}%</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
