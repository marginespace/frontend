import { Globe, ArrowRightCircle } from 'lucide-react';
import Link from 'next/link';

import { type VaultWithApyAndTvl } from '@/actions/get-all-vaults-with-apy-and-tvl';
import { TooltipItem } from '@/components/tooltip-item';
import { Button, buttonVariants } from '@/components/ui/button';
import Timer from '@/components/ui/icons/timer';
import { lastHarvestFormatter } from '@/lib/last-harvest-formatter';
import { cn } from '@/lib/utils';

export type BoostProps = {
  vault: VaultWithApyAndTvl;
};

export const Boost = ({ vault }: BoostProps) => {
  if (!vault.boost) {
    return (
      <div className="flex flex-col gap-[24px] rounded-[12px] p-[16px]">
        Boost not found
      </div>
    );
  }

  return (
    <div className="flex flex-col divide-y divide-dashed divide-white rounded-[12px] p-4 pt-8">
      <div className="flex flex-col gap-[16px] pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-[4px]">
            <p className="text-xl font-semibold leading-[30px]">Active Boost</p>
            <TooltipItem>
              <p className="text-xs font-medium text-text-light">
                Some active boost text
              </p>
            </TooltipItem>
          </div>
          <div className="flex items-center gap-2 rounded-[8px] bg-danger px-2 py-1 text-sm font-medium">
            <Timer className="h-[16px] w-[16px] fill-white" />
            <span>ENDS</span>
            <span>{lastHarvestFormatter(vault.boost.periodFinish)}</span>
          </div>
        </div>
        <div className="flex items-center justify-between rounded-[8px] bg-transparent-bg-dark px-4 py-3">
          <p className="text-sm font-semibold text-text-purple">REWARDS</p>
          <p className="text-base font-medium">0 {vault.boost.earnedToken}</p>
        </div>
        <div>
          <Button
            className={cn(
              buttonVariants(),
              'bg-light-purple flex w-full text-white hover:bg-[#7f75cb]',
            )}
          >
            Switch network
          </Button>
        </div>
      </div>
      <div className="flex flex-col gap-[16px] pt-4">
        <div className="flex items-center justify-between">
          <p className="text-xl font-semibold leading-[30px]">
            Boosted By{' '}
            <span className="text-primary">{vault.boost.name}</span>
          </p>
          <div className="flex items-center gap-[8px]">
            <Link
              href="#"
              className={cn(
                buttonVariants({ variant: 'default' }),
                'hover:border-primary border border-white bg-transparent-bg font-semibold text-white hover:bg-transparent-bg',
              )}
            >
              Website
              <Globe className="ml-2 h-[20px] w-[20px]" />
            </Link>

            <Link
              href="#"
              className={buttonVariants({ variant: 'default', size: 'icon' })}
            >
              T
            </Link>
            <Link
              href="#"
              className={buttonVariants({ variant: 'default', size: 'icon' })}
            >
              T
            </Link>
          </div>
        </div>
        <div className="flex flex-col gap-[16px]">
          <p className="text-sm font-medium">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Deleniti
            dignissimos et explicabo fuga harum incidunt ipsa odio placeat
            recusandae vitae! Facere repudiandae tempore vel voluptatibus! Amet
            consectetur sit veritatis voluptatum!
          </p>
          <div className="flex items-center gap-[16px]">
            <div className="flex w-full gap-[8px] rounded-[8px] bg-transparent-bg-dark px-4 py-2">
              <div className="h-6 w-6 rounded-full bg-gray-800" />
              Earn {vault.boost.earnedToken}
            </div>
            <Link
              href="#"
              className={cn(
                buttonVariants({ variant: 'default' }),
                'hover:border-primary border border-white bg-transparent-bg font-semibold text-white hover:bg-transparent-bg',
              )}
            >
              Explore <ArrowRightCircle className="ml-2 h-[20px] w-[20px]" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
