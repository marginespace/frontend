'use client';

import Link from 'next/link';

import Support24 from '@/ui/icons/support24';
import Telegram from '@/ui/icons/telegram';
import X from '@/ui/icons/x';

export const Footer = () => {
  return (
    <footer className="container m-0 flex min-w-full flex-row flex-wrap items-end justify-between gap-[24px] bg-linear-white py-[16px] text-[14px] font-semibold text-white shadow-[0_-6px_10px_rgba(0,0,0,0.08)] backdrop-blur-[20px] md:flex-row md:items-center">
      <div className="flex w-full flex-row gap-[10px] md:w-auto">
        <Link href="https://x.com/margin_space" target="_blank">
          <X />
        </Link>
        <Link href="mailto:support@marginspace.io">
          <Telegram />
        </Link>
      </div>
      <div className="flex w-2/3 flex-col gap-[24px] md:w-auto md:flex-row">
        <Link href="/docs/privacy-policy.docx">Privacy Policy</Link>
        <Link href="/docs/terms-and-conditions.docx">Terms and Conditions</Link>
        <Link href="/docs/cookie-policy.docx">Cookie Policy</Link>
      </div>
      <div>
       © 2025 Margin Space, Inc.  
      </div>
    </footer>
  );
};
