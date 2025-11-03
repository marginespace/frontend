'use client';

import { getVaultEditDetailsTabs } from './getVaultDetailsTabs';

import { type VaultWithApyAndTvl } from '@/actions/get-all-vaults-with-apy-and-tvl';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

export type VaultDetailsProps = {
  vault: VaultWithApyAndTvl;
};

export const VaultEditDetails = ({ vault }: VaultDetailsProps) => {
  const valultDetailTabs = getVaultEditDetailsTabs(vault);

  return (
    <Tabs defaultValue={valultDetailTabs[0].value}>
      <div className="overflow-x-auto">
        <TabsList className="h-auto justify-normal gap-[8px] rounded-b-[0px] rounded-t-[12px] bg-white bg-opacity-[0.11] pb-0 lg:w-full">
          {valultDetailTabs.map((tab) => (
            <TabsTrigger
              className={cn(
                tab.value === 'boost' && 'bg-[#81E3D8]',
                'rounded-b-[2px] rounded-t-[8px] px-[12px] py-[8px] !text-white data-[state=active]:bg-[#A093FE]',
              )}
              key={tab.value}
              value={tab.value}
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </div>
      {valultDetailTabs.map((tab) => (
        <TabsContent
          className="mt-[24px] rounded-[8px] bg-[#2a2c34]"
          key={tab.value}
          value={tab.value}
        >
          {tab.content}
        </TabsContent>
      ))}
    </Tabs>
  );
};
