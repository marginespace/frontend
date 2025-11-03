'use client';

import { useIsMounted } from '@redduck/helpers-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo } from 'react';
import { formatUnits } from 'viem';
import { useAccount } from 'wagmi';

import { NoWalletDashboard } from './no-wallet';
import { overviewTabs as overviewTabsFn } from './tabs';

import { type CubeWithApyAndTvl } from '@/actions/get-all-cubes';
import { type VaultWithApyAndTvl } from '@/actions/get-all-vaults-with-apy-and-tvl';
import { TooltipItem } from '@/components/tooltip-item';
import {
  BadgeDollarSign,
  CircleDollarSign,
  EmptyWallet,
  Rewards,
  WalletAdd,
} from '@/components/ui/icons';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/ui/button';
import { Skeleton } from '@/ui/skeleton';

type DashboardContentProps = {
  usedBefore: boolean;
  vaults: VaultWithApyAndTvl[];
  cubes: CubeWithApyAndTvl[];
  addressFromUrl?: string;
  isLoading: boolean;
};

const DashboardContent = ({
  usedBefore,
  vaults,
  addressFromUrl,
  cubes,
  isLoading,
}: DashboardContentProps) => {
  const isMounted = useIsMounted();
  const { address } = useAccount();
  const router = useRouter();
  const overviewTabs = useMemo(() => {
    if (isLoading === false) {
      return overviewTabsFn(vaults, cubes);
    }
    return [];
  }, [vaults, cubes, isLoading]);

  useEffect(() => {
    if (isMounted && address && !addressFromUrl) {
      router.replace(`/dashboard?address=${address}`);
    }
  }, [address, addressFromUrl, router, isMounted]);

  const vaultsDashboardLeft = useMemo(() => {
    const totalRewardsVaults = vaults.reduce((acc, vault) => {
      const decimals = vault.dashboard.decimals;
      const deposit = parseFloat(
        formatUnits(BigInt(vault.dashboard.depositedInRaw), decimals),
      );
      const shares = parseFloat(
        formatUnits(BigInt(vault.dashboard.shares), 18),
      );
      const now = deposit * shares;
      return acc + now - deposit;
    }, 0);
    const totalRewardsCubes = cubes.reduce(
      (acc, cube) => acc + (cube.dashboard.pnl > 0 ? cube.dashboard.pnl : 0),
      0,
    );
    const totalRewards = totalRewardsVaults + totalRewardsCubes;
    const dailyRewards = totalRewards / 365;
    const vaultsDeposit = vaults.reduce(
      (acc, vault) => acc + vault.deposited,
      0,
    );
    const cubesDeposit = cubes.reduce(
      (acc, cube) => acc + +formatUnits(BigInt(cube.received), 18),
      0,
    );
    const totalDeposit = vaultsDeposit + cubesDeposit;

    return [
      {
        label: 'Strategies',
        text: cubes.length,
        icon: (
          <BadgeDollarSign className="fill-primary h-[18px] w-[18px]" />
        ),
      },
      {
        label: 'Vaults',
        text: vaults.length,
        icon: (
          <CircleDollarSign className="fill-primary h-[18px] w-[18px]" />
        ),
      },
      {
        label: 'Deposit',
        text: `$${totalDeposit.toFixed(2)}`,
        icon: <WalletAdd className="fill-primary h-[18px] w-[18px]" />,
      },
      {
        label: 'Rewards',
        text: `$${totalRewards.toFixed(2)}`,
        icon: <Rewards className="fill-primary h-[18px] w-[18px]" />,
      },
      {
        label: 'Estimated Daily Rewards',
        text: `$${dailyRewards.toFixed(2)}`,
        icon: (
          <BadgeDollarSign className="fill-primary h-[18px] w-[18px]" />
        ),
      },
    ];
  }, [cubes, vaults]);

  if (!isMounted || !addressFromUrl) {
    return <NoWalletDashboard />;
  }

  return (
    <div className="flex grid-cols-10 flex-col gap-[24px] xl:grid">
      <div className="col-span-3 flex flex-col justify-between gap-2 rounded-[12px] border-2 border-none bg-white bg-opacity-11 p-4 backdrop-blur-2lg">
        {isLoading
          ? Array.from({ length: 5 }).map((_, index) => (
              <div
                key={index}
                className="flex h-full w-full flex-col gap-2 rounded-[8px] bg-white bg-opacity-11 p-4"
              >
                <div className="flex items-center gap-2">
                  <Skeleton className="flex h-6 w-7 !rounded-full" />
                  <Skeleton className="flex h-6 w-full !rounded-[8px]" />
                </div>
                <Skeleton className="flex h-6 w-full !rounded-[8px]" />
              </div>
            ))
          : vaultsDashboardLeft.map((item) => (
              <div
                key={item.label}
                className="flex h-full flex-row justify-between gap-2 rounded-[8px] border-none bg-white bg-opacity-11 p-4 backdrop-blur-2lg xl:flex-col"
              >
                <div className="flex items-center gap-2">
                  {item.icon}
                  <span className="text-sm font-semibold text-light-grey">
                    {item.label}
                  </span>
                </div>
                <span className="text-xl font-semibold">{item.text}</span>
              </div>
            ))}
      </div>
      <div className="border-primary col-span-7 flex flex-col gap-4 rounded-[12px] border-2 bg-gradient-to-b from-[rgba(255,255,255,0.28)] via-[rgba(255,255,255,0.17)] p-4 backdrop-blur-[35px]">
        {usedBefore ? (
          <Tabs defaultValue="chain" className="flex h-full flex-col">
            <div className="flex items-center gap-1 pb-4">
              <h1 className="text-2xl font-semibold">Statistics</h1>
              <TooltipItem>
                <p className="text-base font-medium text-text-light">
                  Detailed statistics about the wallet&apos;s portfolio
                </p>
              </TooltipItem>
            </div>

            <TabsList className="h-fit w-fit gap-2 !rounded-b-none bg-transparent-bg text-white">
              {overviewTabs.map(({ label, value }) => (
                <TabsTrigger
                  className="data-[state=active]:!bg-primary rounded-b-none last:rounded data-[state=active]:!rounded-b-none data-[state=active]:!text-white"
                  key={value}
                  value={value}
                >
                  {label}
                </TabsTrigger>
              ))}
            </TabsList>
            {overviewTabs.map(({ content, value }) => (
              <TabsContent
                className="m-0 h-fit rounded-[16px] rounded-tl-none bg-transparent-bg lg:h-[394px]"
                key={value}
                value={value}
              >
                {content}
              </TabsContent>
            ))}
          </Tabs>
        ) : (
          <div className="mt-6 flex flex-col items-center gap-6">
            <EmptyWallet />
            <div className="text-center">
              <p className="text-sm font-semibold">
                Oops, this address has not been used on our platform yet
              </p>
              <p className="text-primary mt-2 text-sm font-semibold">
                {addressFromUrl}
              </p>
              <p className="mt-2 text-base font-semibold">
                Deposit into a vault to view dashboard for connected wallet or
                enter another wallet address
              </p>
            </div>
            <Button className="bg-primary hover:bg-primary-hover w-[320px] text-base font-semibold text-white">
              <Link href="/">View All Vaults</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardContent;
