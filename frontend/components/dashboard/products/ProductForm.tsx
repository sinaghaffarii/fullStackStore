'use client';

import type { Control, FieldErrors } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import { z } from 'zod';

import type { Product } from '@/types/product';

import { Button } from '@/components/ui/Button';
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
import { useCreateProduct, useUpdateProduct } from '@/services/Products';

import type { ProductFormData } from './ProductForm/schema';

const productSchema = z.object({
  name: z.string().min(2, 'نام محصول باید حداقل 2 کاراکتر باشد'),
  slug: z.string().min(2, 'نامک باید حداقل 2 کاراکتر باشد'),
  description: z.string().optional(),
  base_price: z.number().min(0, 'قیمت نمی‌تواند منفی باشد'),
  category_id: z.string().min(1, 'دسته‌بندی الزامی است'),
  brand_id: z.string().optional(),
  is_featured: z.boolean(),
  is_new: z.boolean(),
  variants: z
    .array(
      z.object({
        sku: z.string().min(1, 'SKU الزامی است'),
        name: z.string().min(1, 'نام الزامی است'),
        price: z.number().optional(),
        stock: z.number().min(0, 'موجودی نمی‌تواند منفی باشد'),
      }),
    )
    .min(1, 'حداقل یک واریانت الزامی است'),
  images: z
    .array(
      z.object({
        url: z.string().min(1, 'آدرس تصویر الزامی است'),
        alt: z.string().optional(),
        is_primary: z.boolean(),
      }),
    )
    .min(1, 'حداقل یک تصویر الزامی است'),
});

type FormData = z.infer<typeof productSchema>;

interface Props {
  initialData?: Product;
}

export function ProductForm({ initialData }: Props) {
  const router = useRouter();
  const isEdit = !!initialData;

  const { mutate: createProduct, isPending: createPending } =
    useCreateProduct();
  const { mutate: updateProduct, isPending: updatePending } =
    useUpdateProduct();

  const form = useForm<FormData>({
    resolver: zodResolver(productSchema),
    defaultValues: getDefaultValues(initialData),
  });

  const handleSuccess = () => router.push('/dashboard/products');

  const onSubmit = (data: FormData) => {
    const mutation =
      isEdit && initialData
        ? {
            fn: updateProduct,
            payload: { id: initialData.id, dto: data as any },
          }
        : { fn: createProduct, payload: data as any };

    mutation.fn(mutation.payload, { onSuccess: handleSuccess });
  };

  return (
    <form
      className="space-y-6"
      noValidate
      onSubmit={form.handleSubmit(onSubmit)}
    >
      <BasicInfoCard control={form.control} errors={form.formState.errors} />
      <VariantsCard control={form.control} errors={form.formState.errors} />
      <ImagesCard control={form.control} errors={form.formState.errors} />
      <FormActions
        isLoading={createPending || updatePending}
        onCancel={() => router.back()}
      />
    </form>
  );
}

function getDefaultValues(initialData?: Product): FormData {
  if (!initialData) {
    return {
      name: '',
      slug: '',
      description: '',
      base_price: 0,
      category_id: '',
      brand_id: '',
      is_featured: false,
      is_new: true,
      variants: [{ sku: '', name: '', stock: 0 }],
      images: [{ url: '', is_primary: true }],
    };
  }

  return {
    name: initialData.name,
    slug: initialData.slug,
    description: initialData.description || '',
    base_price: initialData.base_price,
    category_id: initialData.category?.id || '',
    brand_id: initialData.brand?.id || '',
    is_featured: initialData.is_featured,
    is_new: initialData.is_new,
    variants: [{ sku: '', name: '', stock: 0 }],
    images: [{ url: '', is_primary: true }],
  };
}

function BasicInfoCard({ control, errors }: { control: any; errors: any }) {
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

function NameSlugFields({ control, errors }: { control: any; errors: any }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Controller
        name="name"
        control={control}
        render={({ field: { ref, ...field } }) => (
          <Input
            {...field}
            required
            label="نام محصول"
            error={errors.name?.message}
          />
        )}
      />
      <Controller
        name="slug"
        control={control}
        render={({ field: { ref, ...field } }) => (
          <Input
            {...field}
            required
            label="نامک (Slug)"
            error={errors.slug?.message}
          />
        )}
      />
    </div>
  );
}

function DescriptionField({ control }: { control: any }) {
  return (
    <Controller
      name="description"
      control={control}
      render={({ field }) => (
        <div>
          <Label>توضیحات</Label>
          <Textarea
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
    <div dir="rtl" className="grid gap-4 sm:grid-cols-3">
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
            <SelectTrigger size="lg">
              <SelectValue placeholder="انتخاب کنید" />
            </SelectTrigger>
            <SelectContent>
              {categoryList?.data.items.map((ca) => (
                <SelectItem key={ca.id} value="cat-1">
                  {ca.name}
                </SelectItem>
              ))}
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
            <SelectTrigger size="lg">
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

function FeatureToggles({ control }: { control: any }) {
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

function VariantsCard({ control, errors }: { control: any; errors: any }) {
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
          <VariantRow
            index={index}
            key={field.id}
            canRemove={fields.length > 1}
            control={control}
            errors={errors}
            onRemove={() => remove(index)}
          />
        ))}
      </CardContent>
    </Card>
  );
}

function VariantRow({
  control,
  index,
  errors,
  onRemove,
  canRemove,
}: {
  control: any;
  index: number;
  errors: any;
  onRemove: () => void;
  canRemove: boolean;
}) {
  return (
    <div className="flex gap-4 rounded-lg border p-4">
      <Controller
        name={`variants.${index}.sku`}
        control={control}
        render={({ field: { ref, ...field } }) => (
          <div className="flex-1">
            <Input
              {...field}
              error={errors.variants?.[index]?.sku?.message}
              placeholder="SKU"
            />
          </div>
        )}
      />
      <Controller
        name={`variants.${index}.name`}
        control={control}
        render={({ field: { ref, ...field } }) => (
          <div className="flex-1">
            <Input
              {...field}
              error={errors.variants?.[index]?.name?.message}
              placeholder="نام"
            />
          </div>
        )}
      />
      <Controller
        name={`variants.${index}.stock`}
        control={control}
        render={({ field: { ref, ...field } }) => (
          <div className="w-32">
            <Input
              {...field}
              type="number"
              error={errors.variants?.[index]?.stock?.message}
              onChange={(e) => field.onChange(Number(e.target.value))}
              placeholder="موجودی"
            />
          </div>
        )}
      />
      <Button
        size="icon"
        disabled={!canRemove}
        type="button"
        variant="ghost"
        onClick={onRemove}
      >
        <Trash2 className="size-4" />
      </Button>
    </div>
  );
}

function ImagesCard({ control, errors }: { control: any; errors: any }) {
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
          <ImageRow
            index={index}
            key={field.id}
            canRemove={fields.length > 1}
            control={control}
            errors={errors}
            onRemove={() => remove(index)}
          />
        ))}
      </CardContent>
    </Card>
  );
}

function ImageRow({
  control,
  index,
  errors,
  onRemove,
  canRemove,
}: {
  control: any;
  index: number;
  errors: any;
  onRemove: () => void;
  canRemove: boolean;
}) {
  return (
    <div className="flex gap-4 rounded-lg border p-4">
      <Controller
        name={`images.${index}.url`}
        control={control}
        render={({ field: { ref, ...field } }) => (
          <div className="flex-1">
            <Input
              {...field}
              error={errors.images?.[index]?.url?.message}
              placeholder="آدرس تصویر"
            />
          </div>
        )}
      />
      <Controller
        name={`images.${index}.is_primary`}
        control={control}
        render={({ field }) => (
          <div className="flex items-center gap-2">
            <Switch checked={field.value} onCheckedChange={field.onChange} />
            <Label>اصلی</Label>
          </div>
        )}
      />
      <Button
        size="icon"
        disabled={!canRemove}
        type="button"
        variant="ghost"
        onClick={onRemove}
      >
        <Trash2 className="size-4" />
      </Button>
    </div>
  );
}

function FormActions({
  isLoading,
  onCancel,
}: {
  isLoading: boolean;
  onCancel: () => void;
}) {
  return (
    <div className="flex justify-end gap-4">
      <Button type="button" variant="outline" onClick={onCancel}>
        انصراف
      </Button>
      <Button disabled={isLoading} type="submit">
        {isLoading ? 'در حال ذخیره...' : 'ذخیره محصول'}
      </Button>
    </div>
  );
}
