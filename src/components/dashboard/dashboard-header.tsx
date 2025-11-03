'use client';

import { useIsMounted } from '@redduck/helpers-react';
import { useAccount } from 'wagmi';

import { SearchInput } from '@/components/dashboard/search-input';
import { TooltipItem } from '@/components/tooltip-item';
import { parseAddress } from '@/helpers/parseAddress';

export type DashboardHeaderProps = {
  addressFromUrl?: string;
};

const DashboardHeader = ({ addressFromUrl }: DashboardHeaderProps) => {
  const isMounted = useIsMounted();
  const { isConnected } = useAccount();

  return (
    <div className="flex items-end justify-between pt-6">
      <div className="flex items-end gap-2">
        <h1 className="text-4xl font-semibold">Dashboard</h1>
        {isConnected && isMounted && addressFromUrl && (
          <div className="flex items-center gap-2">
            <span className="text-primary text-base font-medium">
              ({parseAddress(addressFromUrl || '')})
            </span>
            <TooltipItem>
              <p className="text-base font-medium text-text-light">
                {addressFromUrl}
              </p>
            </TooltipItem>
          </div>
        )}
      </div>
      {/* Desktop search (hidden on mobile) */}
      <div className="hidden md:block">
        <SearchInput defaultEmpty className="w-[340px]" />
      </div>
    </div>
  );
};

export default DashboardHeader;
