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
    <main className="mx-auto flex h-full w-full max-w-[95%] flex-col gap-[24px] px-4 sm:max-w-[98%] sm:px-6 md:max-w-[1920px] md:px-8 lg:px-12 xl:max-w-[1535px] 2xl:max-w-[1535px]">
      <h1 className="pt-6 text-4xl font-semibold">Vaults</h1>
      <VaultsContainer searchParams={searchParams} />
    </main>
  );
};

export default Home;
