import type { Control, FieldPath, FieldValues } from 'react-hook-form';

import { Plus, X } from 'lucide-react';
import { useState } from 'react';
import { Controller } from 'react-hook-form';

import { cn } from '@/lib/utils';

import { Badge } from './Badge';
import { Button } from './Button';
import { BaseInput } from './Input';

const DEFAULT_SEPARATOR_REGEX = /[\n,]/g;

interface MultiValueInputProps<T extends FieldValues> {
  control: Control<T>;
  name: FieldPath<T>;
  label?: string;
  placeholder?: string;
  separatorRegex?: RegExp;
  className?: string;
}

function normalizeTag(tag: string) {
  return tag.trim().toLowerCase();
}

export function MultiValueInput<T extends FieldValues>({
  control,
  name,
  label,
  placeholder = 'افزودن تگ...',
  separatorRegex = DEFAULT_SEPARATOR_REGEX,
  className,
}: MultiValueInputProps<T>) {
  const [inputValue, setInputValue] = useState<string>('');

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => {
        const tags: string[] = Array.isArray(field.value) ? field.value : [];

        const addTags = (raw: string) => {
          const parts = raw
            .split(separatorRegex)
            .map((p) => p.trim())
            .filter(Boolean);

          if (parts.length === 0) return;

          const existingNorm = new Set(tags.map(normalizeTag));

          const next = [...tags];
          for (const p of parts) {
            const n = normalizeTag(p);
            if (!existingNorm.has(n)) {
              existingNorm.add(n);
              next.push(p);
            }
          }

          field.onChange(next);
        };

        const removeTag = (tagToRemove: string) => {
          field.onChange(
            tags.filter((t) => normalizeTag(t) !== normalizeTag(tagToRemove)),
          );
        };

        const onSubmitAdd = () => {
          addTags(inputValue);
          setInputValue('');
        };

        return (
          <div className={cn('space-y-2', className)}>
            {label ? (
              <label className="text-sm font-medium text-foreground">
                {label}
              </label>
            ) : null}

            <div className="flex gap-2">
              <BaseInput
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    onSubmitAdd();
                  }
                }}
                placeholder={placeholder}
              />
              <Button type="button" variant="outline" onClick={onSubmitAdd}>
                <Plus />
              </Button>
            </div>

            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <Badge
                  className="flex items-center gap-2"
                  key={tag}
                  variant="secondary"
                >
                  <span>{tag}</span>
                  <X
                    aria-label={`Remove ${tag}`}
                    className="size-4 cursor-pointer hover:text-destructive"
                    onClick={() => removeTag(tag)}
                  />
                </Badge>
              ))}
            </div>
          </div>
        );
      }}
    />
  );
}
