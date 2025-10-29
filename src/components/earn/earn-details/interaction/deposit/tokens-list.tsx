'use client';

import { formatBigIntComa } from '@redduck/helpers-viem';
import { Loader2 } from 'lucide-react';
import { memo } from 'react';

import { type Token } from '@/actions/get-all-tokens';
import { DEFAULT_STABLE } from '@/constants/earn-details';
import { Button } from '@/ui/button';
import { Refresh } from '@/ui/icons';
import { Label } from '@/ui/label';
import { RadioGroup, RadioGroupItem } from '@/ui/radio-group';

export type TokensListProps = {
  vaultBalances: (Token & { balance: bigint; allowance: bigint })[];
  loading: boolean;
  onChange: (value: string) => void;
  onRefreshClick: () => void;
  defaultToken?: string;
};

export const TokensList = memo(
  ({
    vaultBalances,
    loading,
    onChange,
    onRefreshClick,
    defaultToken,
  }: TokensListProps) => {
    return (
      <div className="flex flex-col rounded-[8px] bg-text-grey">
        <div className="p-[16px]">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-[#667085]">Available:</p>
            <Button
              onClick={onRefreshClick}
              className="bg-transparent p-0 hover:bg-transparent"
            >
              {loading ? (
                <Loader2 className="text-primary h-[20px] w-[20px] animate-spin" />
              ) : (
                <Refresh className="fill-light-purple hover:fill-light-purple-hover transition-colors" />
              )}
            </Button>
          </div>

          <RadioGroup
            defaultValue={defaultToken || DEFAULT_STABLE}
            className="mt-[12px] flex flex-col gap-[12px]"
            onValueChange={onChange}
          >
            {vaultBalances.map((asset) => {
              return (
                <div
                  key={asset.id}
                  className="flex items-center justify-between text-[#293056]"
                >
                  <Label
                    className="text-sm font-semibold text-text"
                    htmlFor={`${asset.address}-${asset.symbol}`}
                  >
                    {asset.symbol}
                  </Label>
                  <div className="flex items-center gap-[16px]">
                    <p className="border-b-[1px] border-b-text text-sm font-medium text-text">
                      {formatBigIntComa(
                        asset.balance ?? BigInt(0),
                        asset.decimals ?? 18,
                        2,
                      )}
                    </p>
                    <RadioGroupItem
                      className="border-primary text-primary"
                      value={asset.symbol}
                      id={`${asset.address}-${asset.symbol}`}
                    />
                  </div>
                </div>
              );
            })}
          </RadioGroup>
        </div>
        <div className="flex flex-row justify-between rounded-b-[8px] bg-white p-[16px] text-[14px]">
          <p className=" text-primary text-sm font-semibold">Provider</p>
          <p className="text-sm font-semibold text-text">1Inch</p>
        </div>
      </div>
    );
  },
);
TokensList.displayName = 'TokensList';
