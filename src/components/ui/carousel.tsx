'use client';

import { useRef, useState } from 'react';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { Carousel as CarouselComp } from 'react-responsive-carousel';
import { useAccount } from 'wagmi';

import { PromotionalPoolCard } from '../pools/promotional-pool-card';

import { type VaultWithApyAndTvl } from '@/actions/get-all-vaults-with-apy-and-tvl';
import { useAdmin } from '@/hooks/useAdmin';

type Props = {
  vaults: VaultWithApyAndTvl[];
  type: 'popular' | 'hot' | 'profitable';
};

export const Carousel = ({ vaults, type }: Props) => {
  const carouselRef = useRef<CarouselComp>(null);

  const [count, setCount] = useState(0);
  const { address } = useAccount();
  const isAdmin = useAdmin(address);

  const vaultsWithoutHidden = vaults.filter(
    (vault) => !vault.isHidden || isAdmin,
  );

  return (
    <div className="flex-1 lg:w-[30%]">
      <CarouselComp
        className=""
        showThumbs={false}
        showStatus={false}
        showIndicators={false}
        showArrows={false}
        axis="horizontal"
        ref={carouselRef}
        onChange={setCount}
      >
        {vaultsWithoutHidden.map((vault, i) => (
          <PromotionalPoolCard
            length={vaultsWithoutHidden.length}
            change={carouselRef?.current?.selectItem}
            state={carouselRef?.current?.state}
            count={count}
            key={i}
            vault={vault}
            type={type}
            isAdmin={isAdmin}
          />
        ))}
      </CarouselComp>
    </div>
  );
};
