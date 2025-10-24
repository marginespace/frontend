'use client';

import { useIsMounted } from '@redduck/helpers-react';
import { useAccount } from 'wagmi';

import { Blockicon } from '@/components/blockicon';
import { ConnectWalletButton } from '@/components/connect-wallet-button';
import { Skeleton } from '@/components/ui/skeleton';

export const Profile = () => {
  const isMounted = useIsMounted();
  const { address } = useAccount();

  return (
    <div className="flex items-center gap-2">
      {address && isMounted ? (
        <Blockicon address={address} />
      ) : (
        <Skeleton className="h-[40px] w-[40px] animate-none rounded-full bg-[#667085]" />
      )}
      <ConnectWalletButton />
    </div>
  );
};
