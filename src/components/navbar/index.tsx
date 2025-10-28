'use client';

import Image from 'next/image';
import Link from 'next/link';

import { EthereumButton } from './ethereum-btn';
import { Profile } from './profile';

import { Menu } from '@/components/ui/icons';
import { navbarItems } from '@/constants/navbarItems';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/ui/dropdown-menu';
import { Button } from '@/ui/button';

export const Navbar = () => {
  return (
    <nav className="container m-0 flex min-h-fit min-w-[calc(100%+20px)] flex-row flex-wrap items-center justify-between bg-linear-white px-[24px] py-[16px] backdrop-blur-[58px] lg:px-[48px] lg:py-[20px]">
      {/* Logo */}
      <div className="order-1 flex items-center lg:order-1">
        <Link href="/">
          <Image
            alt="logo"
            src="/icons/logo.svg"
            width={140}
            height={48}
            className="lg:h-[54px] lg:w-[160px]"
          />
        </Link>
      </div>

      {/* Desktop меню - центрировано */}
      <div className="order-3 hidden flex-1 items-center justify-center gap-[32px] lg:order-2 lg:flex">
        {navbarItems.map((item) =>
          item.nestedItems?.length ? (
            // Dropdown для desktop
            <DropdownMenu key={item.id}>
              <DropdownMenuTrigger asChild>
                <Button variant="link" className="group p-0">
                  <item.icon className="h-[20px] w-[20px] fill-white transition-all group-hover:fill-primary" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="mt-2 flex w-[220px] flex-col gap-1 rounded-xl border border-white border-opacity-10 bg-[#0B0B0B] bg-opacity-95 p-3 shadow-lg backdrop-blur-xl">
                {item.nestedItems.map((nestedItem) => (
                  <DropdownMenuItem key={nestedItem.id} asChild>
                    <Link
                      href={nestedItem.link || '#'}
                      className="flex cursor-pointer items-center gap-3 rounded-lg px-4 py-3 text-[15px] font-medium text-white transition-all hover:bg-white hover:bg-opacity-10"
                    >
                      {nestedItem.icon && (
                        <nestedItem.icon className="h-[18px] w-[18px] fill-white" />
                      )}
                      {nestedItem.label}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            // Обычная ссылка для desktop
            <Link
              key={item.id}
              href={item.link || '#'}
              className="group flex items-center gap-2 text-[16px] font-medium text-white transition-all hover:text-primary"
            >
              <item.icon className="h-[20px] w-[20px] fill-white transition-all group-hover:fill-primary" />
              {item.label && (
                <span className="whitespace-nowrap">{item.label}</span>
              )}
            </Link>
          ),
        )}
      </div>

      {/* Правая часть - Profile + Ethereum Button */}
      <div className="order-2 flex items-center gap-[16px] lg:order-3">
        <div className="hidden lg:block">
          <EthereumButton />
        </div>
        <Profile />
      </div>

      {/* Мобильное меню - полная ширина под хедером */}
      <div className="order-4 mt-[16px] w-full border-t border-dashed border-white border-opacity-20 pt-[16px] lg:hidden">
        <div className="flex items-center justify-between">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex cursor-pointer items-center gap-2 border-none bg-transparent p-0 text-white outline-none">
                <Menu className="h-[24px] w-[24px]" />
                <span className="text-[15px] font-medium">Menu</span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="mt-2 flex w-[280px] flex-col gap-1 rounded-xl border border-white border-opacity-10 bg-[#0B0B0B] bg-opacity-95 p-3 shadow-lg backdrop-blur-xl">
              {navbarItems.map((item) =>
                item.nestedItems?.length ? (
                  // Вложенное меню
                  item.nestedItems.map((nestedItem) => (
                    <DropdownMenuItem key={nestedItem.id} asChild>
                      <Link
                        href={nestedItem.link || '#'}
                        className="flex cursor-pointer items-center gap-3 rounded-lg px-4 py-3 text-[15px] font-medium text-white transition-all hover:bg-white hover:bg-opacity-10"
                      >
                        {nestedItem.icon && (
                          <nestedItem.icon className="h-[20px] w-[20px] fill-white" />
                        )}
                        {nestedItem.label}
                      </Link>
                    </DropdownMenuItem>
                  ))
                ) : (
                  // Обычный пункт меню
                  <DropdownMenuItem key={item.id} asChild>
                    <Link
                      href={item.link || '#'}
                      className="flex cursor-pointer items-center gap-3 rounded-lg px-4 py-3 text-[15px] font-medium text-white transition-all hover:bg-white hover:bg-opacity-10"
                    >
                      <item.icon className="h-[20px] w-[20px] fill-white" />
                      {item.label}
                    </Link>
                  </DropdownMenuItem>
                ),
              )}
            </DropdownMenuContent>
          </DropdownMenu>
          <div className="lg:hidden">
            <EthereumButton />
          </div>
        </div>
      </div>
    </nav>
  );
};
