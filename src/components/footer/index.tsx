'use client';

import Link from 'next/link';
import { useEffect } from 'react';

import CookiePolicy from '@/ui/icons/cookie-policy';
import PrivacyPolicy from '@/ui/icons/privacy-policy';
import TermsConditions from '@/ui/icons/terms-conditions';
import Telegram from '@/ui/icons/telegram';
import X from '@/ui/icons/x';

export const Footer = () => {
  useEffect(() => {
    // Загрузка скрипта CommonNinja
    const script = document.createElement('script');
    script.src = 'https://cdn.commoninja.com/sdk/latest/commonninja.js';
    script.defer = true;
    document.body.appendChild(script);

    return () => {
      // Очистка при размонтировании
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  return (
    <footer className="w-full mt-auto bg-linear-white py-4 px-4 text-[14px] font-semibold text-white shadow-[0_-6px_10px_rgba(0,0,0,0.08)] backdrop-blur-[20px] md:py-[16px] md:px-6">
      <div className="mx-auto max-w-[1400px]">
        {/* Mobile Layout: соцсети слева, копирайт по центру, иконки справа */}
        <div className="relative flex flex-row items-center justify-between gap-2 md:hidden">
          {/* Social Links - Left */}
          <div className="flex flex-row items-center gap-[10px] flex-shrink-0">
            <Link 
              href="https://x.com/margin_space" 
              target="_blank"
              rel="noopener noreferrer"
              className="transition-opacity hover:opacity-80 active:opacity-60"
              aria-label="Follow us on X (Twitter)"
            >
              <X />
            </Link>
            <Link 
              href="https://t.me/marginspacesupportteam"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-opacity hover:opacity-80 active:opacity-60"
              aria-label="Contact support via Telegram"
            >
              <Telegram />
            </Link>
          </div>

          {/* Copyright - Center (absolute positioned) */}
          <div className="absolute left-1/2 -translate-x-1/2 text-center text-xs whitespace-nowrap">
            © 2025 Margin Space
          </div>

          {/* Legal Links Icons - Right */}
          <div className="flex flex-row items-center gap-3 flex-shrink-0">
            <Link 
              href="/privacy-policy"
              className="transition-opacity hover:opacity-80 active:opacity-60"
              aria-label="Privacy Policy"
            >
              <PrivacyPolicy className="h-5 w-5 text-white" />
            </Link>
            <Link 
              href="/terms-and-conditions"
              className="transition-opacity hover:opacity-80 active:opacity-60"
              aria-label="Terms and Conditions"
            >
              <TermsConditions className="h-5 w-5 text-white" />
            </Link>
            <Link 
              href="/cookie-policy"
              className="transition-opacity hover:opacity-80 active:opacity-60"
              aria-label="Cookie Policy"
            >
              <CookiePolicy className="h-5 w-5 text-white" />
            </Link>
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden md:flex md:flex-row md:items-center md:justify-between md:gap-6">
          {/* Social Links */}
          <div className="flex flex-row items-center gap-[10px]">
            <Link 
              href="https://x.com/margin_space" 
              target="_blank"
              rel="noopener noreferrer"
              className="transition-opacity hover:opacity-80 active:opacity-60"
              aria-label="Follow us on X (Twitter)"
            >
              <X />
            </Link>
            <Link 
              href="https://t.me/marginspacesupportteam"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-opacity hover:opacity-80 active:opacity-60"
              aria-label="Contact support via Telegram"
            >
              <Telegram />
            </Link>
          </div>

          {/* Legal Links - Text on desktop */}
          <div className="flex flex-row items-center gap-6">
            <Link 
              href="/privacy-policy"
              className="transition-opacity hover:opacity-80 active:opacity-60 whitespace-nowrap"
            >
              Privacy Policy
            </Link>
            <Link 
              href="/terms-and-conditions"
              className="transition-opacity hover:opacity-80 active:opacity-60 whitespace-nowrap"
            >
              Terms and Conditions
            </Link>
            <Link 
              href="/cookie-policy"
              className="transition-opacity hover:opacity-80 active:opacity-60 whitespace-nowrap"
            >
              Cookie Policy
            </Link>
          </div>

          {/* Copyright */}
          <div className="text-right">
            © 2025 Margin Space
          </div>
        </div>
      </div>
      
      {/* CommonNinja Popup Widget */}
      <div className="commonninja_component pid-f0f8e061-66cb-44d6-a767-a594743b49a7"></div>
    </footer>
  );
};
