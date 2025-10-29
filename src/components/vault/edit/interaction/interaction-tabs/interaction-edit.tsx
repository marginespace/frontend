'use client';
import Image from 'next/image';
import { memo, useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { usePublicClient } from 'wagmi';

import { type TokensByName } from '@/actions/get-all-tokens';
import { type VaultWithApyAndTvl } from '@/actions/get-all-vaults-with-apy-and-tvl';
import { TooltipItem } from '@/components/tooltip-item';
import { Button } from '@/components/ui/button';
import { Checkbox, CheckboxIndicator } from '@/components/ui/checkbox';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { AddSquare, ArrowDown } from '@/components/ui/icons';
import { Input } from '@/components/ui/input';
import { SwitchThumb, Switch } from '@/components/ui/switch';
import { getTokenAssetUrl } from '@/constants/assets';
import { useVaultFees } from '@/hooks/useVaultFees';
import { apiChainToWagmi } from '@/lib/api-chain-to-wagmi';
import { cn } from '@/lib/utils';

type Props = {
  vault: VaultWithApyAndTvl;
  tokens: TokensByName;
};

export const InteractionEdit = memo(({ vault, tokens }: Props) => {
  const [open, setOpen] = useState<boolean>(false);
  const [selectedTokens, setSelectedTokens] = useState<string[]>([]);

  const { control } = useFormContext();
  const chainId = apiChainToWagmi(vault.network || '').id;
  const publicClient = usePublicClient({ chainId });
  const { data: feesData, isLoading: isFeesLoading } = useVaultFees(
    vault,
    publicClient,
  );

  const vaultTokens = Object.values(tokens).filter((token) =>
    vault.assets.includes(token.symbol.toUpperCase()),
  );

  const handleClick = () => {
    setOpen((open) => !open);
  };

  const handleTokenClick = (id: string) => {
    if (selectedTokens.includes(id)) {
      setSelectedTokens((prev) => [...prev].filter((t) => t !== id));
    } else {
      setSelectedTokens((prev) => [...prev, id]);
    }
  };

  return (
    <div className="flex flex-col gap-[16px] rounded-b-[12px] rounded-tr-[12px] bg-white bg-opacity-11 p-[16px]">
      <Collapsible className="flex flex-col gap-4">
        <div className="flex flex-col gap-3 rounded-[8px] bg-[rgba(53,40,82,0.43)] p-[16px] shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] backdrop-blur-[10px]">
          <div className="flex flex-row items-center justify-between">
            <p className="text-sm font-semibold text-[#CFC9FF]">
              Select deposit token
            </p>
            <CollapsibleTrigger asChild className="text-[12px]">
              <Button onClick={handleClick} variant="link" className="h-6 p-0">
                <ArrowDown
                  className={cn(
                    open ? '-rotate-180' : '',
                    'transition-transform',
                  )}
                />
              </Button>
            </CollapsibleTrigger>
          </div>
          <div className="flex items-center gap-x-1">
            {selectedTokens.length > 0 ? (
              selectedTokens.map((token) => (
                <Image
                  key={token}
                  width={24}
                  height={24}
                  src={getTokenAssetUrl(token)}
                  alt={token}
                />
              ))
            ) : (
              <p className="inline-flex h-6 items-center text-sm font-medium text-light-grey">
                No tokens selected
              </p>
            )}
          </div>
        </div>

        <CollapsibleContent asChild>
          <div className="shadow-xl">
            <div className="flex flex-col gap-4 rounded-t-[10px] bg-text-grey p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-text-light">
                  Avaliable:
                </p>
                <div className="-mr-0.5 flex items-center gap-2">
                  <p className="text-sm font-semibold text-text">
                    Add new token
                  </p>
                  <Button
                    variant="ghost"
                    className="h-fit w-fit border-0 p-0 hover:bg-transparent"
                  >
                    <AddSquare />
                  </Button>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                {vaultTokens.map((token, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Image
                        key={token.symbol}
                        width={24}
                        height={24}
                        src={getTokenAssetUrl(token.symbol)}
                        alt={token.symbol}
                      />
                      <span className="text-sm font-semibold text-text">
                        {token.symbol}
                      </span>
                    </div>
                    <Checkbox
                      onClick={() => handleTokenClick(token.symbol)}
                      className="border-primary grid place-items-center border"
                    >
                      <CheckboxIndicator />
                    </Checkbox>
                  </div>
                ))}
              </div>
              <Button variant="contained" className="mx-0">
                Select
              </Button>
            </div>
            <div className="flex justify-end rounded-b-[10px] bg-white p-4">
              <Button
                variant="link"
                className="m-0 h-5 p-0 text-sm font-semibold text-black"
              >
                Clear all
              </Button>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
      <div className="flex flex-col gap-[16px] ">
        <div className="gap-6 lg:flex">
          <div className="mb-4 flex-1 lg:mb-0">
            <div className="mb-4 flex gap-2 text-xs font-medium text-text-grey">
              DEPOSIT FEE
              <TooltipItem>
                Fee for deposit charged by the provider or Margin Space
              </TooltipItem>
            </div>
            <div className="mb-2 flex items-center justify-between text-sm font-medium text-white">
              <p>Current fee</p>
              <p>{isFeesLoading ? '...' : `${feesData?.depositFee}%`}</p>
            </div>
            <div className="flex items-center justify-between text-sm font-medium text-white">
              <p>New fee</p>
              <Controller
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder="0%"
                    className="h-5 w-[80px] border-0 bg-transparent-bg-dark p-4 text-center focus-visible:border-0"
                  />
                )}
                name="depositFee"
              />
            </div>
          </div>
          <div className="flex-1">
            <div className="mb-4 flex gap-2 text-xs font-medium text-text-grey">
              WITHDRAW FEE
              <TooltipItem>
                Fee for withdrawal charged by the provider or Margin Space
              </TooltipItem>
            </div>
            <div className="mb-2 flex items-center justify-between text-sm font-medium text-white">
              <p>Current fee</p>
              <p>{isFeesLoading ? '...' : `${feesData?.withdrawFee}%`}</p>
            </div>
            <div className="flex items-center justify-between text-sm font-medium text-white">
              <p>New fee</p>
              <Controller
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder="0.1%"
                    className="h-5 w-[80px] border-0 bg-transparent-bg-dark p-4 text-center focus-visible:border-0"
                  />
                )}
                name="withdrawFee"
              />
            </div>
          </div>
        </div>
        <p className="mb-4 inline text-sm">
          The displayed APY accounts for performance fee that is deducted from
          the generated yield only.
        </p>
        <div className="border-b-2 border-dashed border-additional-grey pb-4">
          <div className="mb-2 text-sm font-semibold text-white">
            Select filters for this vault
          </div>
          <div className="mb-4 gap-6 lg:flex">
            <div className="mb-4 flex flex-1 items-center justify-between lg:mb-0">
              <div className="flex items-center gap-2">
                Featured
                <TooltipItem>
                  <div className="flex w-[250px] flex-col gap-1">
                    <p className="text-xs font-semibold text-text">Featured</p>
                    <p className="text-xs font-medium text-text-light">
                      Please remember to read carefully all the information
                      before taking decision. Also please note that all elements
                      are clickable.
                    </p>
                  </div>
                </TooltipItem>
              </div>

              <Switch>
                <SwitchThumb />
              </Switch>
            </div>
            <div className="flex flex-1 items-center justify-between">
              <div className="flex items-center gap-2">
                Blue chip
                <TooltipItem>
                  <div className="flex w-[250px] flex-col gap-1">
                    <p className="text-xs font-semibold text-text">Featured</p>
                    <p className="text-xs font-medium text-text-light">
                      Please remember to read carefully all the information
                      before taking decision. Also please note that all elements
                      are clickable.
                    </p>
                  </div>
                </TooltipItem>
              </div>

              <Switch>
                <SwitchThumb />
              </Switch>
            </div>
          </div>
          <div className="gap-6 lg:flex">
            <div className="mb-4 flex flex-1 items-center justify-between lg:mb-0">
              <div className="flex items-center gap-2">
                Stablecoins
                <TooltipItem>
                  <div className="flex w-[250px] flex-col gap-1">
                    <p className="text-xs font-semibold text-text">Featured</p>
                    <p className="text-xs font-medium text-text-light">
                      Please remember to read carefully all the information
                      before taking decision. Also please note that all elements
                      are clickable.
                    </p>
                  </div>
                </TooltipItem>
              </div>

              <Switch>
                <SwitchThumb />
              </Switch>
            </div>
            <div className="flex flex-1 items-center justify-between">
              <div className="flex items-center gap-2">
                Correlated{' '}
                <TooltipItem>
                  <div className="flex w-[250px] flex-col gap-1">
                    <p className="text-xs font-semibold text-text">Featured</p>
                    <p className="text-xs font-medium text-text-light">
                      Please remember to read carefully all the information
                      before taking decision. Also please note that all elements
                      are clickable.
                    </p>
                  </div>
                </TooltipItem>
              </div>

              <Switch>
                <SwitchThumb />
              </Switch>
            </div>
          </div>
        </div>

        <div className="flex flex-1 items-center gap-2">
          <div className="flex items-center gap-2">
            Boost{' '}
            <TooltipItem>
              <div className="flex w-[250px] flex-col gap-1">
                <p className="text-xs font-semibold text-text">Featured</p>
                <p className="text-xs font-medium text-text-light">
                  Please remember to read carefully all the information before
                  taking decision. Also please note that all elements are
                  clickable.
                </p>
              </div>
            </TooltipItem>
          </div>

          <Switch>
            <SwitchThumb />
          </Switch>
        </div>
      </div>
    </div>
  );
});
InteractionEdit.displayName = 'InteractionEdit';
