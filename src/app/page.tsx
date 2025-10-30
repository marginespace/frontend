import dynamicImport from 'next/dynamic';

import { type FilterQuery } from '@/lib/filter-vaults';

// Отключаем статическую генерацию для этой страницы
export const dynamic = 'force-dynamic';

const VaultsContainer = dynamicImport(() => import('@/components/vault'), {
  ssr: false,
});

type HomeProps = {
  searchParams: FilterQuery;
};

const Home = async ({ searchParams }: HomeProps) => {
  return (
    <main className="container flex h-full min-w-full flex-col gap-[24px]">
      <h1 className="pt-6 text-4xl font-semibold">Vaults</h1>
      <VaultsContainer searchParams={searchParams} />
    </main>
  );
};

export default Home;
