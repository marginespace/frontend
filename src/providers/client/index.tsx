'use client';

import { type PropsWithChildren } from 'react';

import { QueryClientProvider } from '@/providers/client/query-client-provider';
import { ThemeProvider } from '@/providers/client/theme-provider';
import { WagmiProvider } from '@/providers/client/wagmi-provider';

export const ClientProviders = ({ children }: PropsWithChildren) => {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem={false}
      storageKey="cubera-theme"
    >
      <QueryClientProvider>
        <WagmiProvider>{children}</WagmiProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
};
