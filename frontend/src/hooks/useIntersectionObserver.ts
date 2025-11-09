import { useIntersectionObserver } from '@uidotdev/usehooks';
import { useEffect, useState } from 'react';

export function useLazyLoad(ref: React.RefObject<Element>, options = {}) {
  const [isVisible, setIsVisible] = useState(false);

  const [intersectionRef, entry] = useIntersectionObserver({
    threshold: 0,
    rootMargin: '50px',
    ...options,
  });

  useEffect(() => {
    if (entry?.isIntersecting && !isVisible) {
      setIsVisible(true);
    }
  }, [entry?.isIntersecting, isVisible]);

  return [intersectionRef, isVisible] as const;
}
