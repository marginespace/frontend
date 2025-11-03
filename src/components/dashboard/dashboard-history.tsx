'use client';

import { useIsMounted } from '@redduck/helpers-react';

import { HistoryTable } from './history-table';

import { type CubeWithApyAndTvl } from '@/actions/get-all-cubes';
import { type VaultWithApyAndTvl } from '@/actions/get-all-vaults-with-apy-and-tvl';
import { EarnHistoryTable } from '@/components/dashboard/earn-history-table';
import { TooltipItem } from '@/components/tooltip-item';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/ui/accordion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/ui/tabs';

type DashboardHistoryProps = {
  usedBefore: boolean;
  vaults: VaultWithApyAndTvl[];
  addressFromUrl?: string;
  cubes: CubeWithApyAndTvl[];
};

enum HistoryTabs {
  VAULTS = 'vaults',
  STRATEGIES = 'strategies',
}

const DashboardHistory = ({
  usedBefore,
  vaults,
  addressFromUrl,
  cubes,
}: DashboardHistoryProps) => {
  const isMounted = useIsMounted();

  if (!addressFromUrl || !isMounted || !usedBefore) return null;

  return (
    <Accordion defaultValue={['default']} type="multiple" className="w-full">
      <AccordionItem value="default" className="border-b-0">
        <div className="mb-6 rounded-[16px] bg-white bg-opacity-11 p-4 backdrop-blur-2lg">
          <AccordionTrigger className="p-0 text-2xl font-semibold hover:no-underline">
            <div className="flex items-center gap-1">
              <p>History</p>
              <TooltipItem>
                <p className="text-base font-medium text-text-light">
                  Detailed history of actions and interactions with Margin
                  Space&apos;s vaults and strategies
                </p>
              </TooltipItem>
            </div>
          </AccordionTrigger>
        </div>
        <AccordionContent className="p-0">
          <Tabs defaultValue={HistoryTabs.VAULTS}>
            <TabsList className="h-fit w-full justify-center gap-[8px] bg-transparent">
              <TabsTrigger
                value={HistoryTabs.VAULTS}
                className="data-[state=active]:!bg-primary rounded-[8px] px-[24px] py-[8px] text-[14px] font-semibold !text-white"
              >
                Vaults
              </TabsTrigger>
              <TabsTrigger
                value={HistoryTabs.STRATEGIES}
                className="data-[state=active]:!bg-primary rounded-[8px] px-[24px] py-[8px] text-[14px] font-semibold !text-white"
              >
                Strategies
              </TabsTrigger>
            </TabsList>
            <div className="pt-[24px]">
              <TabsContent value={HistoryTabs.VAULTS} asChild>
                <div className="mb-4 rounded-t-[16px] border-2 border-none bg-white bg-opacity-11 backdrop-blur-2lg [&>div]:rounded-[16px]">
                  <HistoryTable vaults={vaults} />
                </div>
              </TabsContent>
              <TabsContent value={HistoryTabs.STRATEGIES} asChild>
                <div className="mb-4 rounded-t-[16px] border-2 border-none bg-white bg-opacity-11 backdrop-blur-2lg [&>div]:rounded-[16px]">
                  <EarnHistoryTable cubes={cubes} />
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default DashboardHistory;
