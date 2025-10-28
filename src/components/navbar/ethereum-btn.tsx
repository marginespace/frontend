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
        'bg-light-purple inline-flex cursor-pointer items-center gap-2 rounded-[10px] px-3 py-2 hover:!text-white',
        className,
      )}
      onClick={() => open({ view: 'Networks' })}
    >
      {chainImages[networkIdToName[chain.id]]}
      <span className="text-xs font-semibold leading-[18px]">{chain.name}</span>
    </div>
  ) : null;
};
