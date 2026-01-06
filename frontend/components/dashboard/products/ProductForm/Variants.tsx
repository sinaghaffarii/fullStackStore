import type { Control } from 'react-hook-form';

import { Plus, Trash2 } from 'lucide-react';
import { Controller, useFieldArray } from 'react-hook-form';

import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';

import type { ProductFormData } from './schema';

interface Props {
  control: Control<ProductFormData>;
}

export function VariantsCard({ control }: Props) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'variants',
  });

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>واریانت‌ها</CardTitle>
          <Button
            size="sm"
            type="button"
            onClick={() => append({ sku: '', name: '', stock: 0 })}
          >
            <Plus className="ml-2 size-4" />
            افزودن
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {fields.map((field, index) => (
          <div className="flex gap-4 rounded-lg border p-4" key={field.id}>
            <Controller
              name={`variants.${index}.sku`}
              control={control}
              render={({ field: { ref, ...f } }) => (
                <div className="flex-1">
                  <Input {...f} placeholder="SKU" />
                </div>
              )}
            />
            <Controller
              name={`variants.${index}.name`}
              control={control}
              render={({ field: { ref, ...f } }) => (
                <div className="flex-1">
                  <Input {...f} placeholder="نام" />
                </div>
              )}
            />
            <Controller
              name={`variants.${index}.stock`}
              control={control}
              render={({ field: { ref, ...f } }) => (
                <div className="w-32">
                  <Input
                    {...f}
                    type="number"
                    onChange={(e) => f.onChange(Number(e.target.value))}
                    placeholder="موجودی"
                  />
                </div>
              )}
            />
            <Button
              size="icon"
              disabled={fields.length === 1}
              type="button"
              variant="ghost"
              onClick={() => remove(index)}
            >
              <Trash2 className="size-4" />
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
