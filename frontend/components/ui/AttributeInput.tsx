/* eslint-disable max-lines-per-function */
import type { Control, FieldPath, FieldValues } from 'react-hook-form';

import { Plus, X } from 'lucide-react';
import * as React from 'react';
import { Controller } from 'react-hook-form';

import { Badge } from './Badge';
import { Button } from './Button';
import { BaseInput } from './Input';

interface AttributeInputProps<T extends FieldValues> {
  control: Control<T>;
  name: FieldPath<T>;
  label?: string;

  keyPlaceholder?: string;
  valuePlaceholder?: string;
  addButtonLabel?: string;
}

export function AttributeInput<T extends FieldValues>({
  control,
  name,
  label,
  keyPlaceholder = 'ویژگی',
  valuePlaceholder = 'مقدار',
  addButtonLabel = 'افزودن',
}: AttributeInputProps<T>) {
  const [error, setError] = React.useState(false);
  const [keyInput, setKeyInput] = React.useState('');
  const [valueInput, setValueInput] = React.useState('');

  const normalizeKey = (s: string) => s.trim();

  const resetErrorOnTyping = () => {
    if (error) {
      setError(false);
    }
  };

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value } }) => {
        const currentAttributes: Record<string, string> =
          typeof value === 'object' && value !== null && !Array.isArray(value)
            ? value
            : {};

        const getExistingKeys = () => Object.keys(currentAttributes);

        const handleAdd = () => {
          const inputKey = normalizeKey(keyInput);
          const inputValue = valueInput.trim();

          if (!inputKey || !inputValue) {
            return;
          }

          const existingKeys = getExistingKeys();

          if (existingKeys.includes(inputKey)) {
            setError(true);
            return;
          }

          const newAttribute = { [inputKey]: inputValue };
          const nextAttributes = { ...currentAttributes, ...newAttribute };
          onChange(nextAttributes);

          setKeyInput('');
          setValueInput('');
        };

        const handleRemove = (key: string) => {
          const { [key]: _, ...nextAttributes } = currentAttributes;
          onChange(nextAttributes);
        };

        return (
          <div className="space-y-2">
            {label && (
              <label className="text-sm font-medium text-foreground">
                {label}
              </label>
            )}

            <div className="flex gap-2">
              <BaseInput
                value={keyInput}
                onChange={(e) => {
                  setKeyInput(e.target.value);
                  resetErrorOnTyping();
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();

                    if (valueInput.trim()) {
                      handleAdd();
                    }
                  }
                }}
                placeholder={keyPlaceholder}
                className={
                  error || (!keyInput.trim() && valueInput.trim())
                    ? 'border-red-500'
                    : ''
                }
              />

              <BaseInput
                value={valueInput}
                onChange={(e) => {
                  setValueInput(e.target.value);
                  resetErrorOnTyping();
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();

                    if (keyInput.trim()) {
                      handleAdd();
                    }
                  }
                }}
                placeholder={valuePlaceholder}
                className={
                  error || (!valueInput.trim() && keyInput.trim())
                    ? 'border-red-500'
                    : ''
                }
              />

              <Button
                aria-label={addButtonLabel}
                disabled={!keyInput.trim() || !valueInput.trim()}
                type="button"
                variant="outline"
                onClick={handleAdd}
              >
                <Plus />
              </Button>
            </div>
            {error && (
              <p className="text-sm text-red-400">ویژگی وارد شده تکراری است.</p>
            )}
            <div className="flex flex-wrap gap-2">
              {/* نمایش ویژگی‌ها به صورت Badge */}
              {Object.entries(currentAttributes).map(([key, val]) => (
                <Badge
                  className="flex items-center gap-2"
                  key={key}
                  variant="secondary"
                >
                  {`${key}: ${val}`}
                  <X
                    aria-label={`حذف ${key}`}
                    className="size-4 cursor-pointer hover:text-destructive"
                    onClick={() => handleRemove(key)}
                    role="button"
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
