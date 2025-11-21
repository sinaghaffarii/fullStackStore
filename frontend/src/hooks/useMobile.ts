'use client';
import { useEffect, useState } from 'react';

export function useMobile(breakpoint = 768) {
  const mq = window.matchMedia(`(max-width: ${breakpoint - 1}px)`);
  const [isMobile, setIsMobile] = useState<boolean>(mq.matches);

  useEffect(() => {
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);

    if (mq.addEventListener) {
      mq.addEventListener('change', handler);
    } else {
      mq.addListener(handler);
    }

    return () => {
      if (mq.removeEventListener) {
        mq.removeEventListener('change', handler);
      } else {
        mq.removeListener(handler);
      }
    };
  }, [mq]);

  return isMobile;
}
