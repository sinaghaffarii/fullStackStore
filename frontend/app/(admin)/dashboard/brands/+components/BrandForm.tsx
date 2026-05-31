'use client';

import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';

import type { CreateBrandDto, UpsertBrandDto } from '@/services/Brand';
import type { IBrand } from '@/types/brand';

import { ImageUploader } from '@/components/ui/ImageUploader';
import { BaseInput } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Switch } from '@/components/ui/Switch';
import { useCreateBrandItem, useUpsertBrandItem } from '@/services/Brand';

interface Props {
  brand?: IBrand;
  onSuccess: () => void;
}

type FormData = CreateBrandDto & { id?: string };

const defaultValues: FormData = {
  id: undefined,
  name: '',
  name_fa: '',
  slug: '',
  logo: '',
  is_active: true,
};

export function BrandForm({ brand, onSuccess }: Props) {
  const isEdit = !!brand;
  const { mutate: createBrand } = useCreateBrandItem();
  const { mutate: upsertBrand } = useUpsertBrandItem();

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<FormData>({ defaultValues });

  useEffect(() => {
    reset(brand ? { ...brand } : defaultValues);
  }, [brand, reset]);

  const onSubmit = (data: FormData) => {
    if (isEdit && data.id) {
      upsertBrand(data as UpsertBrandDto, { onSuccess });
    } else {
      const { id, ...rest } = data;
      createBrand(rest, { onSuccess });
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
      <Controller
        name="logo"
        rules={{ required: 'لوگو الزامی است' }}
        control={control}
        render={({ field, fieldState }) => (
          <div>
            <ImageUploader
              label="لوگوی برند"
              value={field.value ?? undefined}
              onChange={(url) =>
                setValue('logo', url, { shouldValidate: true })
              }
            />
            {fieldState.error && (
              <p className="mt-1 text-sm text-destructive">
                {fieldState.error.message}
              </p>
            )}
          </div>
        )}
      />

      <Controller
        name="name"
        rules={{ required: 'نام برند الزامی است' }}
        control={control}
        render={({ field: { ref, ...fieldWithoutRef } }) => (
          <BaseInput
            label="نام برند (English)"
            placeholder="مثال: BOBBY JONES"
            {...fieldWithoutRef}
            error={errors.name?.message}
          />
        )}
      />

      <Controller
        name="name_fa"
        rules={{ required: 'نام فارسی برند الزامی است' }}
        control={control}
        render={({ field: { ref, ...fieldWithoutRef } }) => (
          <BaseInput
            label="نام برند (فارسی)"
            placeholder="مثال: بابی جونز"
            {...fieldWithoutRef}
            error={errors.name_fa?.message}
          />
        )}
      />

      <Controller
        name="slug"
        control={control}
        render={({ field: { ref, ...fieldWithoutRef } }) => (
          <BaseInput
            label="اسلاگ (Slug)"
            placeholder="مثال: bobby-jones"
            {...fieldWithoutRef}
            error={errors.slug?.message}
          />
        )}
        rules={{
          required: 'اسلاگ الزامی است',
          pattern: {
            value: /^[0-9a-z]+(?:-[0-9a-z]+)*$/,
            message: 'فقط حروف کوچک، اعداد و خط تیره مجاز است',
          },
        }}
      />

      <Controller
        name="is_active"
        control={control}
        render={({ field: { value, onChange } }) => (
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <Label className="text-base font-medium" htmlFor="is_active">
                وضعیت برند
              </Label>
              <p className="text-sm text-muted-foreground">
                برند فعال در سایت نمایش داده می‌شود
              </p>
            </div>
            <Switch checked={value} id="is_active" onCheckedChange={onChange} />
          </div>
        )}
      />
    </form>
  );
}
