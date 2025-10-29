import { Globe } from 'lucide-react';
import Link from 'next/link';
import * as chains from 'viem/chains';
import { type Chain } from 'viem/chains';

import { type VaultWithApyAndTvl } from '@/actions/get-all-vaults-with-apy-and-tvl';
import { buttonVariants } from '@/components/ui/button';
import { ApyBreakdownItem } from '@/components/vault/vault-details/strategy/apy-breakdown-item';
import { apyFormatter } from '@/lib/apy-formatter';
import { cn } from '@/lib/utils';

const chainsTyped = chains as Record<string, Chain>;

export type StrategyProps = {
  vault: VaultWithApyAndTvl;
};

export const Strategy = ({ vault }: StrategyProps) => {
  const chainName = vault.chain === 'ethereum' ? 'mainnet' : vault.chain;

  return (
    <div className="flex flex-col gap-[24px] rounded-[12px] p-4">
      <div className="flex items-center gap-[8px]">
        {vault.isMultiToken && (
          <Link
            href={`${chainsTyped[chainName]?.blockExplorers?.default.url}/address/${vault.strategy}`}
            target="_blank"
            className={cn(
              buttonVariants({ variant: 'default' }),
              'hover:border-primary border border-white bg-transparent-bg font-semibold text-white hover:bg-transparent-bg',
            )}
          >
            Strategy address <Globe className="ml-2 h-[20px] w-[20px]" />
          </Link>
        )}

        <Link
          href={`${chainsTyped[chainName]?.blockExplorers?.default.url}/address/${vault.earnContractAddress}`}
          target="_blank"
          className={cn(
            buttonVariants({ variant: 'default' }),
            'hover:border-light-purple border border-white bg-transparent-bg font-semibold text-white hover:bg-transparent-bg',
          )}
        >
          Vault address <Globe className="ml-2 h-[20px] w-[20px]" />
        </Link>
      </div>
      <p className="text-sm font-medium">
        The vault puts the user&apos;s {vault.name} into a{' '}
        {vault.platformId.toUpperCase()} farm to earn the platform&apos;s
        governance token. The earned token is then exchanged for more of the
        original assets to get more of the same liquidity token. To keep the
        cycle going, the new {vault.name} is added to the farm for the next
        earning event. The transaction cost for all this is shared among the
        vault&apos;s users.
      </p>
      <div className="flex flex-col gap-[16px] rounded-[8px]">
        <p className="text-base font-semibold">APY Breakdown</p>
        <div className="grid grid-cols-3 gap-[8px]">
          <ApyBreakdownItem
            className="border-none bg-transparent-bg-dark"
            label="TOTAL APY"
          >
            {apyFormatter(vault.apy.totalApy)}
          </ApyBreakdownItem>
          <ApyBreakdownItem
            className="border-none bg-transparent-bg-dark"
            label="VAULT APR"
          >
            {apyFormatter(vault.apy.vaultApr)}
          </ApyBreakdownItem>
          <ApyBreakdownItem
            className="border-none bg-transparent-bg-dark"
            label="BOOST APR"
          >
            {apyFormatter(0)}
          </ApyBreakdownItem>
        </div>
      </div>
    </div>
  );
};
