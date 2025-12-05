'use client';

import { useCallback, useSyncExternalStore } from 'react';

export function useMobile(breakpoint = 768) {
  const subscribe = useCallback(
    (callback: () => void) => {
      const mq = window.matchMedia(`(max-width: ${breakpoint - 1}px)`);

      if (mq.addEventListener) {
        mq.addEventListener('change', callback);
      } else {
        mq.addListener(callback);
      }

      return () => {
        if (mq.removeEventListener) {
          mq.removeEventListener('change', callback);
        } else {
          mq.removeListener(callback);
        }
      };
    },
    [breakpoint],
  );

  const getSnapshot = () => {
    return window.matchMedia(`(max-width: ${breakpoint - 1}px)`).matches;
  };

  const getServerSnapshot = () => {
    return false;
  };

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
