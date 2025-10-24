import dynamic from 'next/dynamic';

import { getChainConfig } from '@/actions/get-chain-config';
import { type FilterQuery } from '@/lib/filter-vaults';

const EarnWrapper = dynamic(() => import('@/components/earn'), {
  ssr: false,
});

type EarnProps = {
  searchParams: FilterQuery;
};

const EarnPage = async ({ searchParams }: EarnProps) => {
  const configs = await getChainConfig();

  return <EarnWrapper searchParams={searchParams} configs={configs} />;
};

export default EarnPage;
