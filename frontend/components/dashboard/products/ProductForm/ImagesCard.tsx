import type { Control } from 'react-hook-form';

import { Plus, Trash2 } from 'lucide-react';
import { Controller, useFieldArray } from 'react-hook-form';

import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Switch } from '@/components/ui/Switch';

import type { ProductFormData } from './schema';

interface Props {
  control: Control<ProductFormData>;
}

export function ImagesCard({ control }: Props) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'images',
  });

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>تصاویر</CardTitle>
          <Button
            size="sm"
            type="button"
            onClick={() => append({ url: '', is_primary: false })}
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
              name={`images.${index}.url`}
              control={control}
              render={({ field: { ref, ...f } }) => (
                <div className="flex-1">
                  <Input {...f} placeholder="آدرس تصویر" />
                </div>
              )}
            />
            <Controller
              name={`images.${index}.is_primary`}
              control={control}
              render={({ field: f }) => (
                <div className="flex items-center gap-2">
                  <Switch checked={f.value} onCheckedChange={f.onChange} />
                  <Label>اصلی</Label>
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
