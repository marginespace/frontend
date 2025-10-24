'use client';

import {
  QueryClientProvider as RqQueryClientProvider,
  QueryClient,
} from '@tanstack/react-query';
import { type PropsWithChildren, useState } from 'react';

export const QueryClientProvider = ({ children }: PropsWithChildren) => {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <RqQueryClientProvider client={queryClient}>
      {children}
    </RqQueryClientProvider>
  );
};
