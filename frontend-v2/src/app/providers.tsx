import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React, { useEffect } from 'react';

import { SocketProvider } from '@/app/socket.provider';
import { SplashScreen } from '@/shared/components/template/splash-screen';
import { paths } from '@/shared/config/paths';
import { queryConfig } from '@/shared/lib/react-query';
import { LocalStorageEventTarget } from '@/shared/lib/storage';
import { Toaster } from '@/shared/ui/sonner';

type AppProviderProps = {
  children: React.ReactNode;
};
export const AppProvider = ({ children }: AppProviderProps) => {
  const [queryClient] = React.useState(
    () =>
      new QueryClient({
        defaultOptions: queryConfig,
      }),
  );

  useEffect(() => {
    const handleTokenCleared = () => {
      window.location.replace(paths.auth.login.path);
    };

    LocalStorageEventTarget.addEventListener('tokenCleared', handleTokenCleared);
    return () => {
      LocalStorageEventTarget.removeEventListener('tokenCleared', handleTokenCleared);
    };
  }, []);

  return (
    <React.Suspense fallback={<SplashScreen />}>
      <QueryClientProvider client={queryClient}>
        <SocketProvider>
          {children}
          <Toaster position="top-right" />
        </SocketProvider>
      </QueryClientProvider>
    </React.Suspense>
  );
};
