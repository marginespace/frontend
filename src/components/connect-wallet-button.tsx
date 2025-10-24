'use client';

import { useIsMounted } from '@redduck/helpers-react';
import { useWeb3Modal } from '@web3modal/wagmi/react';
import { useAccount, useNetwork } from 'wagmi';

import { Button } from '@/components/ui/button';
import { shortenAddress } from '@/lib/shorten-address';

type ConnectWalletButtonProps = {
  className?: string;
};

export const ConnectWalletButton = ({
  className,
}: ConnectWalletButtonProps) => {
  const isMounted = useIsMounted();
  const { chain } = useNetwork();
  const { address, isConnected } = useAccount();
  const { open } = useWeb3Modal();

  if (!isMounted) {
    return <Button className={className}>Connect Wallet</Button>;
  }

  if (!isConnected || !address) {
    return (
      <Button className={className} onClick={() => open({ view: 'Connect' })}>
        Connect Wallet
      </Button>
    );
  }

  if (chain?.unsupported) {
    return (
      <Button className={className} onClick={() => open({ view: 'Networks' })}>
        Unsupported Network
      </Button>
    );
  }

  return (
    <Button className={className} onClick={() => open({ view: 'Account' })}>
      {shortenAddress(address)}
    </Button>
  );
};
