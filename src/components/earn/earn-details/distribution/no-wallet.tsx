'use client';

import { ConnectWalletButton } from '@/components/connect-wallet-button';
import { EmptyWallet } from '@/ui/icons';

export const NoWalletEarnDetails = () => {
  return (
    <div className="container mb-12 flex h-full items-center justify-center rounded-[16px] border-2 border-light-purple bg-gradient-to-b from-[rgba(255,255,255,0.28)] via-[rgba(255,255,255,0.17)] p-3 backdrop-blur-[35px]">
      <div className="flex flex-col items-center gap-6">
        <EmptyWallet />
        <div className="text-center">
          <h2 className="text-base font-semibold">No address selected</h2>
          <h5 className="mt-2 text-sm font-semibold text-light-grey">
            No wallet connected. Connect your wallet or search for an address
          </h5>
        </div>
        <ConnectWalletButton className="w-[320px] bg-light-purple text-base font-semibold text-white hover:bg-light-purple-hover" />
      </div>
    </div>
  );
};
