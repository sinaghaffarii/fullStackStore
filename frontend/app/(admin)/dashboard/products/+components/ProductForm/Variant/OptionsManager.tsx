import { Plus } from 'lucide-react';
import { useFieldArray, useFormContext } from 'react-hook-form';

import type { ProductFormType } from '@/validations';

import { Button } from '@/components/ui/Button';
import { Label } from '@/components/ui/Label';
import { VariantOptionType } from '@/types/product';

import { OptionItem } from './OptionItem';

interface OptionsManagerProps {
  variantIndex: number;
}

export function OptionsManager({ variantIndex }: OptionsManagerProps) {
  const { control } = useFormContext<ProductFormType>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: `variants.${variantIndex}.options`,
  });

  const addOption = () => {
    append({ type: VariantOptionType.COLOR, label: '', value: '' });
  };

  return (
    <>
      <Label className="mb-2 block">آپشن‌ها</Label>
      <div className="space-y-3">
        {fields.map((field, index) => (
          <OptionItem
            key={field.id}
            variantIndex={variantIndex}
            isRemovable={fields.length > 1}
            onRemove={() => remove(index)}
            optionIndex={index}
          />
        ))}
        <Button size="sm" type="button" variant="outline" onClick={addOption}>
          <Plus className="mr-2 size-4" />
          افزودن آپشن
        </Button>
      </div>
    </>
  );
}
