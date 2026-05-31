import { Controller, useFormContext } from 'react-hook-form';

import type { ProductFormType } from '@/validations';

import { CurrencyInput } from '@/components/ui/CurrencyInput';
import { ImageUploader } from '@/components/ui/ImageUploader';
import { FormInput } from '@/components/ui/Input';

import { OptionsManager } from './OptionsManager';

interface VariantFormFieldsProps {
  variantIndex: number;
}

export function VariantFormFields({ variantIndex }: VariantFormFieldsProps) {
  const {
    control,
    formState: { errors },
  } = useFormContext<ProductFormType>();

  const basePath = `variants.${variantIndex}`;

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <div className="col-span-2">
        <Controller
          name={`${basePath}.image_url` as any}
          control={control}
          render={({ field, fieldState }) => (
            <div>
              <ImageUploader
                label="تصویر واریانت"
                value={field.value ?? undefined}
                onChange={field.onChange}
              />
              {fieldState.error && (
                <p className="text-sm text-red-500">
                  {fieldState.error.message}
                </p>
              )}
            </div>
          )}
        />
      </div>

      <FormInput
        required
        label="نام واریانت"
        name={`${basePath}.name` as any}
      />
      <FormInput
        required
        label="موجودی"
        name={`${basePath}.stock` as any}
        type="number"
      />

      <Controller
        name={`${basePath}.price` as any}
        control={control}
        render={({ field: { ref, value, ...field } }) => (
          <CurrencyInput
            {...field}
            required
            label="قیمت (تومان)"
            value={value ?? undefined}
            error={errors.variants?.[variantIndex]?.price?.message}
          />
        )}
      />

      <Controller
        name={`${basePath}.compare_price` as any}
        control={control}
        render={({ field: { ref, value, ...field } }) => (
          <CurrencyInput
            {...field}
            label="قیمت مقایسه‌ای (اختیاری)"
            value={value ?? null}
            error={errors.variants?.[variantIndex]?.compare_price?.message}
          />
        )}
      />

      <div className="col-span-2">
        <OptionsManager variantIndex={variantIndex} />
      </div>
    </div>
  );
}
