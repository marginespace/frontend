'use client';

import { Loader2 } from 'lucide-react';
import { memo } from 'react';

import { type Token } from '@/actions/get-all-tokens';
import { Button } from '@/components/ui/button';
import { Refresh } from '@/components/ui/icons';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

export type WithdrawTokensListProps = {
  tokens: Token[];
  loading: boolean;
  onChange: (vault: string) => void;
  onRefreshClick: () => void;
  defaultToken?: string;
};

export const WithdrawTokensList = memo(
  ({
    tokens,
    loading,
    onChange,
    onRefreshClick,
    defaultToken,
  }: WithdrawTokensListProps) => {
    return (
      <div className="flex flex-col rounded-[8px] bg-[#F1F3F8]">
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
            defaultValue={defaultToken}
            className="mt-[12px] flex flex-col gap-[12px]"
            onValueChange={onChange}
          >
            {tokens.map((token) => (
              <div
                key={token.id}
                className="flex items-center justify-between text-[#293056]"
              >
                <Label
                  className="text-sm font-semibold text-text"
                  htmlFor={`${token.address}-${token.symbol}`}
                >
                  {token.symbol}
                </Label>
                <RadioGroupItem
                  className="border-primary text-primary"
                  value={token.symbol}
                  id={`${token.address}-${token.symbol}`}
                />
              </div>
            ))}
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
WithdrawTokensList.displayName = 'WithdrawTokensList';
