import type { Control, FieldErrors } from 'react-hook-form';

import { Controller } from 'react-hook-form';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { CurrencyInput } from '@/components/ui/CurrencyInput';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/Select';
import { Switch } from '@/components/ui/Switch';
import { Textarea } from '@/components/ui/Textarea';
import { useGetBrandList } from '@/services/Brand';
import { useGetCategoryList } from '@/services/Category';

import type { ProductFormData } from './schema';

interface Props {
  control: Control<ProductFormData>;
  errors: FieldErrors<ProductFormData>;
}

export function BasicInfoCard({ control, errors }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>اطلاعات پایه</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <NameSlugFields control={control} errors={errors} />
        <DescriptionField control={control} />
        <PriceCategoryBrandFields control={control} errors={errors} />
        <FeatureToggles control={control} />
      </CardContent>
    </Card>
  );
}

function NameSlugFields({
  control,
  errors,
}: {
  control: Control<ProductFormData>;
  errors: FieldErrors<ProductFormData>;
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Controller
        name="name"
        control={control}
        render={({ field: { ref, ...field } }) => (
          <div>
            <Input
              {...field}
              required
              label="نام محصول"
              error="پر کردن این فیلد الزامیست."
            />
          </div>
        )}
      />
      <Controller
        name="slug"
        control={control}
        render={({ field: { ref, ...field } }) => (
          <div>
            <Input
              {...field}
              required
              label="نامک (Slug)"
              error="پر کردن این فیلد الزامیست."
            />
          </div>
        )}
      />
    </div>
  );
}

function DescriptionField({ control }: { control: Control<ProductFormData> }) {
  return (
    <Controller
      name="description"
      control={control}
      render={({ field }) => (
        <div>
          <Textarea
            label="توضیحات"
            maxLength={500}
            value={field.value || ''}
            onBlur={field.onBlur}
            onChange={field.onChange}
            rows={4}
          />
        </div>
      )}
    />
  );
}

function PriceCategoryBrandFields({
  control,
  errors,
}: {
  control: Control<ProductFormData>;
  errors: FieldErrors<ProductFormData>;
}) {
  const { data: brandList, isPending: brandListPending } = useGetBrandList({
    limit: 100,
    page: 1,
  });
  const { data: categoryList, isPending: categoryListPending } =
    useGetCategoryList({
      limit: 100,
      page: 1,
    });
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <Controller
        name="base_price"
        control={control}
        render={({ field: { ref, ...field } }) => (
          <CurrencyInput
            {...field}
            required
            label="قیمت پایه"
            error={errors.base_price?.message}
            placeholder="مثال: 1,000,000"
          />
        )}
      />

      <Controller
        name="category_id"
        control={control}
        render={({ field }) => (
          <Select
            required
            label="دسته‌بندی"
            value={field.value}
            error={errors.category_id?.message}
            onValueChange={field.onChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="انتخاب کنید" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="cat-1">دسته 1</SelectItem>
              <SelectItem value="cat-2">دسته 2</SelectItem>
            </SelectContent>
          </Select>
        )}
      />

      <Controller
        name="brand_id"
        control={control}
        render={({ field }) => (
          <Select
            label="برند"
            value={field.value || ''}
            onValueChange={field.onChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="انتخاب کنید" />
            </SelectTrigger>
            <SelectContent>
              {brandList?.data.items.map((br) => (
                <SelectItem key={br.id} value="brand-1">
                  {br.name_fa}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      />
    </div>
  );
}

function FeatureToggles({ control }: { control: Control<ProductFormData> }) {
  return (
    <div className="flex gap-6">
      <Controller
        name="is_featured"
        control={control}
        render={({ field }) => (
          <div className="flex items-center gap-2">
            <Switch checked={field.value} onCheckedChange={field.onChange} />
            <Label>محصول ویژه</Label>
          </div>
        )}
      />
      <Controller
        name="is_new"
        control={control}
        render={({ field }) => (
          <div className="flex items-center gap-2">
            <Switch checked={field.value} onCheckedChange={field.onChange} />
            <Label>محصول جدید</Label>
          </div>
        )}
      />
    </div>
  );
}
