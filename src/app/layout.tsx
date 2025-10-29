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
    <html lang="en" style={{ zoom: '0.8' }}>
      <body className="flex min-h-screen flex-col bg-[url('/margin-background.svg')] bg-cover bg-fixed bg-top bg-no-repeat">
        <ClientProviders>
          <div className="flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </ClientProviders>
        <Toaster />
      </body>
    </html>
  );
};

export default RootLayout;
