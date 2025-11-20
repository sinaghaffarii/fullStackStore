import { useRef, useEffect, useState } from 'react';

export const useLazyLoad = <T extends HTMLElement>(
  ref: React.RefObject<T | null>,
  options?: IntersectionObserverInit,
) => {
  const [isVisible, setIsVisible] = useState(false);
  const observer = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    if (ref.current) {
      observer.current = new IntersectionObserver(([entry]) => {
        setIsVisible(entry.isIntersecting);
      }, options);

      observer.current.observe(ref.current);
    }

    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, [ref, options]);

  return [ref, isVisible] as const;
};
