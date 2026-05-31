'use client';

import { debounce } from 'lodash';
import { Search } from 'lucide-react';
import { useEffect, useMemo } from 'react';

import { BaseInput } from '@/components/ui/Input';

interface Props {
  value: string;
  onChange: (value: string) => void;
  onDebouncedChange: (value: string) => void;
}

export function CategorySearch({ value, onChange, onDebouncedChange }: Props) {
  const debouncedCallback = useMemo(
    () =>
      debounce((searchValue: string) => {
        onDebouncedChange(searchValue);
      }, 1000),
    [onDebouncedChange],
  );

  useEffect(() => {
    debouncedCallback(value);
    return () => debouncedCallback.cancel();
  }, [value, debouncedCallback]);

  return (
    <div className="relative max-w-sm">
      <Search className="absolute top-1/2 right-3 size-4 -translate-y-1/2 text-muted-foreground" />
      <BaseInput
        className="pr-10"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="جستجو در دسته‌بندی‌ها…"
      />
    </div>
  );
}
