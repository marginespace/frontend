'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

import { EthereumButton } from './ethereum-btn';
import { Profile } from './profile';
import { MobileMenu } from './mobile-menu';

import { Menu } from '@/components/ui/icons';
import { navbarItems } from '@/constants/navbarItems';
import { Button } from '@/ui/button';
import { CustomDropdown } from '@/components/ui/custom-dropdown';

export const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);

  return (
    <>
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />
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

      {/* Desktop меню - центрировано (показывать на экранах > 768px) */}
      <div className="order-3 hidden flex-1 items-center justify-center gap-[32px] md:order-2 md:flex">
        {navbarItems.map((item) =>
          item.nestedItems?.length ? (
            // Dropdown для desktop
            <div key={item.id} className="relative inline-block">
              <CustomDropdown
                open={openDropdown === item.id}
                onOpenChange={(isOpen) => setOpenDropdown(isOpen ? item.id : null)}
                align="center"
                className="flex w-[220px] flex-col gap-2 rounded-[10px] bg-white p-2 shadow-[0px_4px_42px_rgba(0,0,0,0.78)]"
                trigger={
                  <button className="group p-0 bg-transparent border-none cursor-pointer">
                    <item.icon className="h-[20px] w-[20px] fill-white transition-all group-hover:fill-primary" />
                  </button>
                }
              >
                {item.nestedItems.map((nestedItem) => (
                  <Link
                    key={nestedItem.id}
                    href={nestedItem.link || '#'}
                    onClick={() => setOpenDropdown(null)}
                    className="flex cursor-pointer items-center gap-3 rounded-[4px] px-4 py-2 text-[14px] font-medium text-[#0B0B0B] transition-all duration-300 hover:bg-primary hover:text-white hover:scale-[1.02] hover:shadow-[0_0_10px_rgba(212,107,48,0.3)]"
                  >
                    {nestedItem.icon && (
                      <nestedItem.icon className="h-[18px] w-[18px] fill-[#0B0B0B]" />
                    )}
                    {nestedItem.label}
                  </Link>
                ))}
              </CustomDropdown>
            </div>
          ) : (
            // Обычная ссылка для desktop
            <Link
              key={item.id}
              href={item.link || '#'}
              className="group relative flex items-center gap-2 text-[16px] font-medium text-white transition-all duration-300 hover:text-primary after:absolute after:bottom-[-8px] after:left-0 after:h-[2px] after:w-0 after:bg-primary after:transition-all after:duration-300 hover:after:w-full"
            >
              <item.icon className="h-[20px] w-[20px] fill-white transition-all duration-300 group-hover:fill-primary group-hover:scale-110" />
              {item.label && (
                <span className="whitespace-nowrap">{item.label}</span>
              )}
            </Link>
          ),
        )}
      </div>

      {/* Правая часть - Profile + Ethereum Button */}
      <div className="order-2 flex items-center gap-[16px] md:order-3">
        <div className="hidden md:block">
        <EthereumButton />
        </div>
        <Profile />
      </div>
    </nav>
    
    {/* Мобильное меню - секция под хедером (показывать только на мобильных < 768px) */}
    <div className="block w-full md:hidden">
      <div className="w-full border-t border-white/5 bg-white/[0.02] px-[24px] py-[12px] backdrop-blur-[8px]">
        <button
          onClick={() => setIsMobileMenuOpen(true)}
          className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-[12px] border border-primary/40 bg-gradient-to-r from-primary/15 via-primary/10 to-primary/5 px-4 py-3 text-white shadow-[0_2px_8px_rgba(0,0,0,0.15)] transition-all hover:border-primary hover:from-primary/20 hover:via-primary/15 hover:to-primary/10 hover:shadow-[0_0_20px_rgba(212,107,48,0.4)] active:scale-[0.98]"
        >
          <Menu className="h-[20px] w-[20px]" />
          <span className="text-[15px] font-semibold">Menu</span>
        </button>
      </div>
    </div>
    </>
  );
};
