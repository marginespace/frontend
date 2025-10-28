import { isAddress } from 'viem';

import DashboardHeader from '@/components/dashboard/dashboard-header';
import DashboardLoad from '@/components/dashboard/dashboard-load';

// Отключаем статическую генерацию для этой страницы
export const dynamic = 'force-dynamic';

type DashboardProps = {
  searchParams: {
    address?: string;
  };
};

const Dashboard = async ({ searchParams }: DashboardProps) => {
  const addressFromUrl = isAddress(searchParams.address ?? '')
    ? searchParams.address
    : undefined;

  return (
    <main className="container flex h-full min-w-full flex-col gap-[24px]">
      <DashboardHeader addressFromUrl={addressFromUrl} />
      <DashboardLoad addressFromUrl={addressFromUrl} />
    </main>
  );
};

export default Dashboard;
