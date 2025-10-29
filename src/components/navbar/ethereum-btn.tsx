'use client';

import { useIsMounted } from '@redduck/helpers-react';
import { useWeb3Modal } from '@web3modal/wagmi/react';
import { type FC } from 'react';
import { useNetwork } from 'wagmi';

import { chainImages, networkIdToName } from '@/constants/vaults';
import { cn } from '@/lib/utils';

export const EthereumButton: FC<{ className?: string }> = ({ className }) => {
  const isMounted = useIsMounted();
  const { chain } = useNetwork();
  const { open } = useWeb3Modal();

  return isMounted && chain ? (
    <div
      className={cn(
        'bg-transparent inline-flex cursor-pointer items-center justify-center rounded-[10px] border border-primary bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-2 text-white transition-all hover:border-primary-hover hover:shadow-[0_0_15px_rgba(212,107,48,0.5)]',
        className,
      )}
      onClick={() => open({ view: 'Networks' })}
      title={chain.name}
    >
      {chainImages[networkIdToName[chain.id]]}
    </div>
  ) : null;
};
