'use client';
import { useRouter } from 'next/navigation';
import { type MouseEvent, useCallback } from 'react';

import { Button } from '../ui/button';
import FireSvg from '../ui/icons/fire';

import { type VaultWithApyAndTvl } from '@/actions/get-all-vaults-with-apy-and-tvl';
import { chainImages } from '@/constants/vaults';
import { apyFormatter } from '@/lib/apy-formatter';
import { BadgeDollarSign, ArrowLeft, ArrowRight } from '@/ui/icons';

interface PromotionalPoolCardProps {
  vault: VaultWithApyAndTvl;
  type: 'popular' | 'hot' | 'profitable';
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  change: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  state: any;
  count: number;
  length: number;
  isAdmin: boolean;
}

const badges = {
  popular: (
    <div className="flex items-center rounded-[8px] bg-[#CAA550] px-3 py-2">
      <p className="cursor-default text-sm font-semibold">Most Popular</p>
      <BadgeDollarSign className="fill-white pl-1" />
    </div>
  ),
  hot: (
    <div className="flex items-center rounded-[8px] bg-[#D85F5A] px-3 py-2">
      <p className="cursor-default text-sm font-semibold">Hot Vault</p>
      <FireSvg className="pl-1" />
    </div>
  ),
  profitable: (
    <div className="flex items-center rounded-[8px] bg-[#59B38A] px-3 py-2">
      <p className="cursor-default text-sm font-semibold">Most Profitable</p>
      <BadgeDollarSign className="fill-white pl-1" />
    </div>
  ),
};

export const PromotionalPoolCard = ({
  vault,
  change,
  type,
  state,
  count,
  length,
  isAdmin,
}: PromotionalPoolCardProps) => {
  const onNext = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();

      if (count === length - 1) return;
      change({ ...state, selectedItem: count + 1 });
    },
    [count, length, change, state],
  );

  const onPrev = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();

      if (count === 0) return;
      change({ ...state, selectedItem: count - 1 });
    },
    [count, change, state],
  );

  const router = useRouter();

  const handleClick = useCallback(
    () => router.push(`/vault/${vault.id}`),
    [router, vault.id],
  );

  const handlePromotedVaultsClick = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      router.push(`/promoted-vaults`);
    },
    [router],
  );

  return (
    <div className="group/card w-full snap-center transition-all">
      <div
        onClick={handleClick}
        className="border-primary block rounded-[16px] border-2 bg-linear-black p-[16px] text-base font-bold transition-all hover:cursor-pointer backdrop-blur-[16px]"
      >
        <div className="mb-[12px]">{vault.name}</div>
        <div className="flex items-center justify-between rounded-[8px] bg-gradient-to-r from-gray-200 px-[12px] py-[10px] text-[16px] font-semibold">
          <span className="text-sm text-gray-800">APY</span>
          <span className="text-xl text-white">
            {apyFormatter(vault.apy.totalApy)}
          </span>
        </div>
        <div className="flex justify-between border-b-2 border-dashed border-primary pb-[12px]"></div>
        <div className="relative flex justify-between pb-[16px] pt-[12px]">
          <div className="flex">
            <h3 className="text-[14px] font-semibold leading-[20px] text-gray-400">
              Platform
            </h3>
            <h4 className="ml-[6px] text-[14px] font-semibold leading-[20px] text-primary">
              {vault.platformId.toUpperCase()}
            </h4>
          </div>

          <div className="flex">
            <h3 className="mr-1.5 text-right text-[14px] font-semibold leading-[20px] text-gray-400">
              Chain
            </h3>
            {chainImages[vault.chain] ?? <div>{vault.chain}</div>}
          </div>
        </div>
        <div className="flex items-center justify-between">
          {badges[type]}
          <div className="flex gap-2">
            <Button
              className="group hover:bg-transparent"
              variant="ghost"
              onClick={onPrev}
            >
              <ArrowLeft className="fill-light-purple cursor-pointer transition-all group-hover:fill-white" />
            </Button>
            <Button
              className="group px-0 hover:bg-transparent"
              variant="ghost"
              onClick={onNext}
            >
              <ArrowRight className="fill-light-purple cursor-pointer transition-all group-hover:fill-white" />
            </Button>
          </div>
        </div>
        {isAdmin && type === 'hot' ? (
          <Button
            onClick={handlePromotedVaultsClick}
            className="bg-light-purple hover:bg-light-purple-hover mt-4 w-full text-white"
          >
            Promote
          </Button>
        ) : null}
      </div>
    </div>
  );
};
