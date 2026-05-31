import { Trash2 } from 'lucide-react';
import { Controller, useFormContext } from 'react-hook-form';

import type { ProductFormType } from '@/validations';

import { Button } from '@/components/ui/Button';
import { FormInput } from '@/components/ui/Input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/Select';
import { VariantOptionType } from '@/types/product';

const variantTypes = [
  { id: VariantOptionType.COLOR, name: 'رنگ' },
  { id: VariantOptionType.SIZE, name: 'سایز' },
  { id: VariantOptionType.MATERIAL, name: 'جنس' },
];

interface OptionItemProps {
  variantIndex: number;
  optionIndex: number;
  onRemove: () => void;
  isRemovable: boolean;
}

export function OptionItem({
  variantIndex,
  optionIndex,
  onRemove,
  isRemovable,
}: OptionItemProps) {
  const { control } = useFormContext<ProductFormType>();
  const basePath = `variants.${variantIndex}.options.${optionIndex}`;

  return (
    <div className="grid grid-cols-1 gap-3 rounded-md border-2 border-dashed p-3 sm:grid-cols-3">
      <Controller
        name={`${basePath}.type` as any}
        control={control}
        render={({ field }) => (
          <Select value={field.value as string} onValueChange={field.onChange}>
            <SelectTrigger>
              <SelectValue placeholder="نوع آپشن" />
            </SelectTrigger>
            <SelectContent>
              {variantTypes.map((type) => (
                <SelectItem key={type.id} value={type.id}>
                  {type.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      />

      <FormInput
        name={`${basePath}.label` as any}
        placeholder="نام (مثلاً: قرمز)"
      />

      <FormInput
        name={`${basePath}.value` as any}
        placeholder="مقدار (مثلاً: red)"
      />

      <div className="flex justify-end sm:col-span-3">
        <Button
          size="icon"
          disabled={!isRemovable}
          type="button"
          variant="outline"
          onClick={onRemove}
        >
          <Trash2 className="size-4" />
        </Button>
      </div>
    </div>
  );
}
