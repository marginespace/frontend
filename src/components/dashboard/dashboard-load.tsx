'use client';

import DashboardContent from './dashboard-content';
import DashboardHistory from './dashboard-history';
import { useCubesAndVaults } from './useCubesAndVaults';

type DashboardLoadProps = {
  addressFromUrl?: string;
};

export default function DashboardLoad({ addressFromUrl }: DashboardLoadProps) {
  const { cubes, vaults, usedBefore, isLoading } = useCubesAndVaults(
    addressFromUrl || '',
  );

  return (
    <>
      <DashboardContent
        addressFromUrl={addressFromUrl}
        cubes={cubes}
        vaults={vaults}
        usedBefore={usedBefore}
        isLoading={isLoading}
      />
      <DashboardHistory
        usedBefore={usedBefore}
        vaults={vaults}
        addressFromUrl={addressFromUrl}
        cubes={cubes}
      />
    </>
  );
}
