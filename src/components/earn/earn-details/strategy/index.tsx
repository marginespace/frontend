import { Globe } from 'lucide-react';
import Link from 'next/link';
import * as chains from 'viem/chains';
import { type Chain } from 'viem/chains';

import { type CubeWithApyAndTvl } from '@/actions/get-all-cubes';
import { BreakdownItem } from '@/components/earn/earn-details/strategy/breakdown-item';
import { buttonVariants } from '@/components/ui/button';
import { apyFormatter } from '@/lib/apy-formatter';
import { cn } from '@/lib/utils';

const chainsTyped = chains as Record<string, Chain>;

export type StrategyProps = {
  cube: CubeWithApyAndTvl;
};

export const Strategy = ({ cube }: StrategyProps) => {
  const chainName = cube.network === 'ethereum' ? 'mainnet' : cube.network;

  return (
    <div className="flex flex-col gap-[24px] rounded-[12px] p-4 pt-8">
      <div className="flex items-center gap-[8px]">
        {/*<Link*/}
        {/*  href={`${chainsTyped[chainName]?.blockExplorers?.default.url}/address/${cube.earn}`}*/}
        {/*  target="_blank"*/}
        {/*  className={cn(*/}
        {/*    buttonVariants({ variant: 'default' }),*/}
        {/*    'border border-white bg-transparent-bg font-semibold text-white hover:border-light-purple hover:bg-transparent-bg',*/}
        {/*  )}*/}
        {/*>*/}
        {/*  Strategy address <Globe className="ml-2 h-[20px] w-[20px]" />*/}
        {/*</Link>*/}
        <Link
          href={`${chainsTyped[chainName]?.blockExplorers?.default.url}/address/${cube.earn}`}
          target="_blank"
          className={cn(
            buttonVariants({ variant: 'default' }),
            'hover:border-primary border border-white bg-transparent-bg font-semibold text-white hover:bg-transparent-bg',
          )}
        >
          Vault address <Globe className="ml-2 h-[20px] w-[20px]" />
        </Link>
      </div>
      <p className="text-sm font-medium">
        The vault puts the user&apos;s{' '}
        {cube.vaults.map((v) => v.name).join('/')} into a{' '}
        {cube.vaults[0].platformId.toUpperCase()} farm to earn the
        platform&apos;s governance token. The earned token is then exchanged for
        more of the original assets to get more of the same liquidity token. To
        keep the cycle going, the new {cube.vaults.map((v) => v.name).join('/')}{' '}
        is added to the farm for the next earning event. The transaction cost
        for all this is shared among the vault&apos;s users
      </p>
      <div className="flex w-full items-center justify-between rounded-[8px] bg-white px-[16px] py-[8px] md:bg-transparent-bg">
        <div className="text-[14px] font-semibold leading-[20px] text-text md:text-white">
          Overall Average APY
        </div>
        <div className="text-[20px] font-semibold leading-[30px] text-text md:text-white">
          {apyFormatter(cube.avgAPY)}
        </div>
      </div>
      <div className="flex flex-col gap-[16px] rounded-[8px]">
        <p className="text-base font-semibold">APY Breakdown</p>
        <div className="grid grid-cols-1 gap-[16px] md:grid-cols-3 md:gap-[8px]">
          {cube.vaults.map((vault) => (
            <BreakdownItem key={vault.id} vault={vault} />
          ))}
        </div>
      </div>
    </div>
  );
};
