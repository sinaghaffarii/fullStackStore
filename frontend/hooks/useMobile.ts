'use client';

import { useCallback, useSyncExternalStore } from 'react';

interface UseMobileResult {
  isMobile: boolean;
  isReady: boolean; // وقتی هنوز SSR snapshot است، false می‌ماند
}

export function useMobile(breakpoint = 768): UseMobileResult {
  const query = `(max-width: ${breakpoint - 1}px)`;

  const subscribe = useCallback(
    (callback: () => void) => {
      const mq = window.matchMedia(query);

      const handler = () => callback();
      mq.addEventListener?.('change', handler);
      // فallback برای مرورگرهای قدیمی
      mq.addListener?.(handler);

      return () => {
        mq.removeEventListener?.('change', handler);
        mq.removeListener?.(handler);
      };
    },
    [query],
  );

  const getSnapshot = useCallback(() => {
    return window.matchMedia(query).matches as boolean | null;
  }, [query]);

  // eslint-disable-next-line @eslint-react/no-unnecessary-use-callback
  const getServerSnapshot = useCallback(() => {
    return null as boolean | null;
  }, []);

  const match = useSyncExternalStore<boolean | null>(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  const isReady = match !== null;

  return {
    isMobile: !!match,
    isReady,
  };
}
