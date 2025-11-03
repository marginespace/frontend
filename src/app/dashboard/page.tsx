import { isAddress } from 'viem';

import DashboardHeader from '@/components/dashboard/dashboard-header';
import DashboardLoad from '@/components/dashboard/dashboard-load';
import { SearchInput } from '@/components/dashboard/search-input';

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
      {/* Mobile search just under the Dashboard title */}
      <div className="md:hidden">
        <SearchInput defaultEmpty className="w-full" />
      </div>
      <DashboardLoad addressFromUrl={addressFromUrl} />
    </main>
  );
};

export default Dashboard;
