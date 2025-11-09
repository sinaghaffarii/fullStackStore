'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { debounce } from 'lodash';
import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute
            gcTime: 5 * 60 * 1000, // 5 minutes
            retry: 1,
          },
        },
      }),
  );

  // Track page views for analytics
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const url = `${pathname}?${searchParams}`;

    const trackPageView = debounce(() => {
      // Send pageview to analytics
      if (typeof window.gtag !== 'undefined') {
        window.gtag('config', process.env.NEXT_PUBLIC_GA_ID || '', {
          page_path: url,
        });
      }
    }, 300);

    trackPageView();

    return () => {
      trackPageView.cancel();
    };
  }, [pathname, searchParams]);

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
