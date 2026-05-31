/* eslint-disable max-lines */
import type { Control, FieldErrors } from 'react-hook-form';

import { Controller, useFormContext } from 'react-hook-form';

import type { ProductFormType } from '@/validations';

import { AttributeInput } from '@/components/ui/AttributeInput';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { CurrencyInput } from '@/components/ui/CurrencyInput';
import { FormInput } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { MultiValueInput } from '@/components/ui/MultiValueInput';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/Select';
import { Switch } from '@/components/ui/Switch';
import { FormTextarea } from '@/components/ui/Textarea';
import { useGetBrandList } from '@/services/Brand';
import { useGetCategoryList } from '@/services/Category';
import { ProductStatus } from '@/types/product';

export function BasicInfoCard() {
  const {
    control,
    formState: { errors },
  } = useFormContext<ProductFormType>();

  return (
    <Card>
      <CardHeader>
        <CardTitle>اطلاعات پایه</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <NameSlugFields />
        <DescriptionField />
        <PriceCategoryBrandFields control={control} errors={errors} />
        <FeatureToggles />
      </CardContent>
    </Card>
  );
}

function NameSlugFields() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <FormInput required label="نام محصول" name="name" />
      <FormInput required label="نام محصول (انگلیسی)" name="slug" />
    </div>
  );
}

function DescriptionField() {
  return (
    <FormTextarea label="توضیحات" maxLength={500} name="description" rows={4} />
  );
}

function PriceCategoryBrandFields({
  control,
  errors,
}: {
  control: Control<ProductFormType>;
  errors: FieldErrors<ProductFormType>;
}) {
  const { data: brandList } = useGetBrandList({
    limit: 100,
    page: 1,
  });
  const { data: categoryList } = useGetCategoryList({
    limit: 100,
    page: 1,
  });
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <Controller
        name="base_price"
        control={control}
        render={({ field }) => (
          <CurrencyInput
            required
            disabled={field.disabled}
            label="قیمت پایه (تومان)"
            name={field.name}
            value={field.value ?? null}
            error={errors.base_price?.message}
            onBlur={field.onBlur}
            onChange={(val) => {
              field.onChange(val === null ? undefined : val);
            }}
          />
        )}
      />
      <Controller
        name="category_id"
        control={control}
        render={({ field }) => {
          const categoryData = categoryList?.data?.items;
          return (
            <Select
              required
              label="دسته‌بندی"
              value={field.value ?? ''}
              error={errors.category_id?.message}
              onValueChange={field.onChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="انتخاب کنید" />
              </SelectTrigger>
              <SelectContent>
                {categoryData && categoryData.length > 0 ? (
                  categoryData.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="none">مورد یافت نشد</SelectItem>
                )}
              </SelectContent>
            </Select>
          );
        }}
      />
      <Controller
        name="brand_id"
        control={control}
        render={({ field }) => (
          <Select
            required
            label="برند"
            value={field.value ?? ''}
            error={errors.brand_id?.message}
            onValueChange={field.onChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="انتخاب کنید" />
            </SelectTrigger>
            <SelectContent>
              {brandList?.data.items.map((br) => (
                <SelectItem key={br.id} value={br.id}>
                  {br.name_fa}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      />
      <Controller
        name="status"
        control={control}
        render={({ field }) => {
          return (
            <Select
              required
              label="وضعیت"
              value={field.value ?? ''}
              error={errors.status?.message}
              onValueChange={field.onChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="انتخاب کنید" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ProductStatus.ACTIVE}>فعال</SelectItem>
                <SelectItem value={ProductStatus.INACTIVE}>غیرفعال</SelectItem>
              </SelectContent>
            </Select>
          );
        }}
      />
      <MultiValueInput<ProductFormType>
        label="تگ ها"
        name="tags"
        control={control}
      />
      <AttributeInput<ProductFormType>
        label="ویژگی ها"
        name="specifications"
        control={control}
      />
    </div>
  );
}

function FeatureToggles() {
  const { watch, setValue } = useFormContext<ProductFormType>();
  return (
    <div className="flex gap-6">
      <div className="flex items-center gap-2">
        <Switch
          checked={watch('is_featured')}
          name="is_featured"
          onCheckedChange={(checked) => setValue('is_featured', checked)}
        />
        <Label>محصول ویژه</Label>
      </div>

      <div className="flex items-center gap-2">
        <Switch
          checked={watch('is_new')}
          name="is_new"
          onCheckedChange={(checked) => setValue('is_new', checked)}
        />
        <Label>محصول جدید</Label>
      </div>
    </div>
  );
}
