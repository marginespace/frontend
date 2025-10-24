'use client';

import Image from 'next/image';
import { Fragment } from 'react';

import { DropdownItem } from './dropdown-item';
import { EthereumButton } from './ethereum-btn';
import { NavbarItem } from './navbar-item';
import { Profile } from './profile';

import CuberaLabel from '@/components/ui/cubera-label';
import { Menu } from '@/components/ui/icons';
import { navbarItems } from '@/constants/navbarItems';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/ui/dropdown-menu';

export const Navbar = () => {
  const navbarItemsBlock = navbarItems.map((item) =>
    item.nestedItems?.length ? (
      <DropdownItem key={item.id} item={item} />
    ) : (
      <NavbarItem key={item.id} item={item} />
    ),
  );

  return (
    <nav className="container m-0 flex min-h-fit min-w-[calc(100%+20px)] flex-row flex-wrap justify-between border-b border-white bg-gradient-to-r from-[#282236] to-[#25214b] py-[16px] 2xl:gap-[24px]">
      <div className="order-1 flex w-1/2 flex-row items-center gap-1 xl:order-1 xl:w-auto">
        <Image alt="logo" src="/icons/logo.svg" width={36} height={32} />
        <CuberaLabel />
      </div>
      <div className="order-2 flex w-1/2 items-center justify-end xl:order-3 xl:hidden xl:w-auto 2xl:flex">
        <EthereumButton />
      </div>
      <div className="order-3 my-[16px] w-full border-[1px] border-dashed border-b-[#C6C6CC] xl:hidden" />
      <Fragment>
        <div className="order-4 flex grow items-center xl:order-2 xl:hidden">
          <DropdownMenu>
            <DropdownMenuTrigger className="cursor-pointer">
              <Menu />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="ml-[12px] flex flex-col items-start gap-[12px] bg-white bg-opacity-11 p-[12px] backdrop-blur-lg">
              {navbarItemsBlock}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="order-4 hidden w-1/2 grow items-center justify-center gap-1 xl:order-2 xl:flex xl:w-auto xl:gap-[12px]">
          {navbarItemsBlock}
        </div>
      </Fragment>
      <div className="order-5 xl:order-4">
        <Profile />
      </div>
    </nav>
  );
};
