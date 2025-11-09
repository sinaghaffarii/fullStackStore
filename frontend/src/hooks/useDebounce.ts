import { useDebouncedCallback } from '@uidotdev/usehooks';
import { useEffect, useState } from 'react';

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  const debouncedFunction = useDebouncedCallback((newValue: T) => {
    setDebouncedValue(newValue);
  }, delay);

  useEffect(() => {
    debouncedFunction(value);
  }, [value, debouncedFunction]);

  return debouncedValue;
}
