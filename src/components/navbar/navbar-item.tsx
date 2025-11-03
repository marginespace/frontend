'use client';

import { useIsMounted } from '@redduck/helpers-react';
import clsx from 'clsx';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { useAccount } from 'wagmi';

import { buttonVariants } from '@/components/ui/button';
import { type TNavbarItem } from '@/constants/navbarItems';

interface NavbarItemProps {
  item: TNavbarItem;
}

export const NavbarItem = ({ item }: NavbarItemProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const pathname = usePathname();
  const { address } = useAccount();
  const isMounted = useIsMounted();
  return (
    <Link
      key={item.label}
      href={
        (item.link === '/dashboard' && address && isMounted
          ? `${item.link}?address=${address}`
          : item.link) || '#'
      }
      className={clsx(
        'group relative !rounded-[10px]',
        buttonVariants({ variant: 'link' }),
        pathname === item.pathname ? 'bg-primary/20 hover:!text-primary' : '',
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <item.icon className="mr-2 h-[18px] w-[18px] fill-white group-hover:fill-current" />
      <span className="text-sm font-medium lg:text-base">{item.label}</span>
      {isHovered && item.link == '#' && (
        <span className="absolute left-4 top-9 flex w-[100px] animate-appear justify-center whitespace-nowrap break-words rounded-lg bg-white px-2 py-3 text-center text-xs font-semibold text-text">
          Coming soon
        </span>
      )}
    </Link>
  );
};
