'use client';
import { Globe } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';

import { type VaultWithApyAndTvl } from '@/actions/get-all-vaults-with-apy-and-tvl';
import { Button } from '@/components/ui/button';
import { EditSvg } from '@/components/ui/icons/edit';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ApyBreakdownItem } from '@/components/vault/vault-details/strategy/apy-breakdown-item';
import { apyFormatter } from '@/lib/apy-formatter';

export type StrategyProps = {
  vault: VaultWithApyAndTvl;
};

export const Strategy = ({ vault }: StrategyProps) => {
  const [text, setText] = useState(
    `The vault puts the user's ${
      vault.name
    } into a ${vault.platformId.toUpperCase()} farm to earn the platform's governance token. The earned token is then exchanged for more of the original assets to get more of the same liquidity token. To keep the cycle going, the new ${
      vault.name
    } is added to the farm for the next earning event. The transaction cost for all this is shared among the vault's users.`,
  );
  const [isEdit, setEdit] = useState(true);
  const [idealHeight, setIdealHeight] = useState(0);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef && textareaRef.current) {
      const scrollHeight = textareaRef.current.scrollHeight;
      setIdealHeight(scrollHeight + 2);
    }
  }, [textareaRef, text]);
  useEffect(() => {
    setEdit(false);
  }, []);

  const handleClick = useCallback(() => {
    setEdit(!isEdit);
  }, [isEdit]);

  return (
    <div className="flex flex-col gap-[24px] rounded-[12px] p-4">
      <div className="flex items-center gap-6">
        {vault.isMultiToken && (
          <div className="flex-1">
            <div className="mb-2">Strategy address</div>
            <div className="relative">
              <Input
                className="rounded-[12px] bg-[#52515E]  pl-12 leading-5 placeholder:text-[#C6C6CC] focus-visible:ring-0 focus-visible:ring-offset-0"
                placeholder="Link"
              />
              <Globe className="absolute left-4 top-2 h-[20px] w-[20px]" />
            </div>
          </div>
        )}

        <div className="flex-1">
          <div className="mb-2">Vault address</div>
          <div className="relative">
            <Input
              className="rounded-[12px] bg-[#52515E]  pl-12 leading-5 placeholder:text-[#C6C6CC] focus-visible:ring-0 focus-visible:ring-offset-0"
              placeholder="Link"
            />
            <Globe className="absolute left-4 top-2 h-[20px] w-[20px]" />
          </div>
        </div>
      </div>
      <div>
        {isEdit ? (
          <Textarea
            style={{ height: idealHeight }}
            ref={textareaRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="mb-2 resize-none rounded-[12px] bg-[#52515E] leading-5 placeholder:text-[#C6C6CC] focus-visible:ring-0 focus-visible:ring-offset-0"
          />
        ) : (
          <p className="mb-2 text-sm font-medium">{text}</p>
        )}
        <div className="flex justify-end">
          <Button
            onClick={handleClick}
            variant="transparent"
            className="flex gap-2"
          >
            {isEdit ? 'Cancel Edit' : 'Edit'} <EditSvg />
          </Button>
        </div>
      </div>
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
