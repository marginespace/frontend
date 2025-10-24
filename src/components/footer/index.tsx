'use client';

import Link from 'next/link';

import Support24 from '@/ui/icons/support24';
import Telegram from '@/ui/icons/telegram';
import X from '@/ui/icons/x';

export const Footer = () => {
  return (
    <footer className="container m-0 flex min-w-full flex-row flex-wrap items-end justify-between gap-[24px] bg-gradient-to-r from-[#282236] to-[#25214b] py-[16px] text-[14px] font-semibold text-white lg:flex-row lg:items-center">
      <div className="flex w-full flex-row gap-[10px] lg:w-auto">
        <Link href="https://x.com/margin_space" target="_blank">
          <X />
        </Link>
        <Link href="mailto:support@marginspace.io">
          <Telegram />
        </Link>
      </div>
      <div className="flex w-2/3 flex-col gap-[24px] lg:w-auto lg:flex-row">
        <Link href="/docs/privacy-policy.docx">Privacy Policy</Link>
        <Link href="/docs/terms-and-conditions.docx">Terms and Conditions</Link>
        <Link href="/docs/cookie-policy.docx">Cookie Policy</Link>
      </div>
      <div>
        <Link href="/contact-us" className="flex flex-row gap-[8px]">
          <Support24 />
          Contact
        </Link>
      </div>
    </footer>
  );
};
