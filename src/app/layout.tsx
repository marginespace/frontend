import './globals.css';
import type { Metadata } from 'next';
import { type PropsWithChildren } from 'react';

import { Footer } from '@/components/footer';
import { Navbar } from '@/components/navbar';
import { Toaster } from '@/components/ui/toaster';
import { appDescription, appName } from '@/constants/metadata';
import { ClientProviders } from '@/providers/client';

export const metadata: Metadata = {
  title: appName,
  description: appDescription,
};

const RootLayout = ({ children }: PropsWithChildren) => {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col overflow-hidden bg-[url('/main-bg.jpg')] bg-[length:120vw] bg-fixed bg-[-4rem_30%] lg:bg-[-8rem_30%]">
        <ClientProviders>
          <div className="flex h-full flex-col overflow-y-auto overflow-x-hidden">
            <Navbar />
            <div className="flex-1">{children}</div>
            <Footer />
          </div>
        </ClientProviders>
        <Toaster />
      </body>
    </html>
  );
};

export default RootLayout;
