'use client';
import { type HTMLAttributes, forwardRef, type MouseEvent } from 'react';
import { useWalletClient } from 'wagmi';

import { deletePromotedVaults } from '@/actions/delete-promouted-vaults';
import { type VaultWithApyAndTvl } from '@/actions/get-all-vaults-with-apy-and-tvl';
import { Button } from '@/components/ui/button';
import { Check, Close } from '@/components/ui/icons';
import { chainImages } from '@/constants/vaults';
import { apyFormatter } from '@/lib/apy-formatter';
import { cn } from '@/lib/utils';

export type VaultItemProps = HTMLAttributes<HTMLDivElement> & {
  id: string;
  displayedIndex?: number;
  length?: number;
  vault: VaultWithApyAndTvl;
  addedDate?: string;
  selected?: boolean;
  onCloseClick?: (id: string) => void;
  onCheckboxClick?: (id: string) => void;
};

export const VaultItem = forwardRef<HTMLDivElement, VaultItemProps>(
  (props, ref) => {
    const {
      className,
      style,
      length,
      vault,
      selected,
      displayedIndex,
      onCloseClick,
      onCheckboxClick,
      addedDate,
      ...otherProps
    } = props;

    const { data: walletClient } = useWalletClient();

    const handleCloseClick = async (e: MouseEvent<HTMLOrSVGElement>) => {
      e.preventDefault();
      e.stopPropagation();

      if (onCloseClick && vault.id && walletClient) {
        const res = await deletePromotedVaults([vault.id], walletClient);
        if (res && res.status === 200) {
          onCloseClick(vault.id);
        }
      }
    };

    const handlePromoteVault = () => {
      if (onCheckboxClick && vault.id) {
        onCheckboxClick(vault.id);
      }
    };

    const dividerStyles =
      'border-b border-dashed border-[rgba(255,255,255,0.2)]';

    return (
      <div
        className={cn(
          'border-primary z-0 flex select-none flex-col rounded-[10px] border p-4',
          className,
          selected
            ? 'bg-gradient-to-b from-[rgba(212,107,48,0.50)] via-[rgba(255,255,255,0)]'
            : 'bg-gradient-to-b from-[rgba(255,255,255,0.28)] via-[rgba(255,255,255,0.17)]',
        )}
        ref={ref}
        style={style}
        {...otherProps}
      >
        <div
          className={cn(
            dividerStyles,
            'flex items-center justify-between pb-2',
          )}
        >
          {length ? (
            <>
              <p className="text-base font-semibold">
                <span>{displayedIndex || '#'}</span>
                <span className="text-light-grey">/{length}</span>
              </p>
              <Close
                onClick={handleCloseClick}
                className="z-10 cursor-pointer fill-white"
              />
            </>
          ) : (
            <div className="flex w-full items-center justify-between">
              {/* TODO: load actual icons */}
              <div className="flex items-center gap-1">
                <div className="flex h-6 w-6 rounded-full bg-slate-600" />
                <div className="flex h-6 w-6 rounded-full bg-slate-600" />
                <div className="flex h-6 w-6 rounded-full bg-slate-600" />
              </div>
              <Button
                onClick={handlePromoteVault}
                className="bg-transparent p-0 hover:bg-transparent"
              >
                <Check
                  className={cn(
                    'transition-colors hover:fill-white',
                    selected ? 'fill-white' : 'fill-[rgba(41,45,50,50)]',
                  )}
                />
              </Button>
            </div>
          )}
        </div>
        <div className={cn(dividerStyles, 'mb-2')}>
          <p className="mb-3 mt-1 text-base font-semibold">
            {vault.assets.join(', ')}
          </p>
          <div className="mb-[12px] flex items-center justify-between rounded-[8px] bg-gradient-to-r from-primary px-[12px] py-[6px]">
            <span className="text-sm font-semibold text-black xl:text-base">
              {vault.name}
            </span>
            <span className="text-sm font-semibold text-white xl:text-xl">
              {apyFormatter(vault.apy.totalApy)}
            </span>
          </div>
        </div>
        <div className={cn(dividerStyles, 'flex justify-between pb-2')}>
          <div className="flex gap-[6px]">
            <h3 className="text-sm font-semibold leading-[20px] text-light-grey">
              Platform
            </h3>
            <h4 className="text-sm font-semibold leading-[20px] text-primary">
              {vault.platformId}
            </h4>
          </div>
          <div className="flex items-center gap-[6px]">
            <h3 className="text-right text-sm font-semibold leading-[20px] text-light-grey">
              Chain
            </h3>
            {chainImages[vault.chain] ?? <div>{vault.chain}</div>}
          </div>
        </div>
        {addedDate && (
          <div className="mt-2 flex gap-4 text-sm font-semibold">
            <span className="text-light-grey">Added to hot</span>
            <span className="text-white">{addedDate}</span>
          </div>
        )}
      </div>
    );
  },
);
VaultItem.displayName = 'VaultItem';
