/* eslint-disable max-lines-per-function */
'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

import type { Product } from '@/types/product';

import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Select, SelectItem } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';

interface Props {
  initialData?: Product;
}

export function ProductForm({ initialData }: Props) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const isEdit = !!initialData;

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: initialData || {
      name: '',
      slug: '',
      description: '',
      price: 0,
      originalPrice: 0,
      discount: 0,
      stock: 0,
      brand: '',
      category: '',
      inStock: true,
      isNew: false,
      isBestseller: false,
      specifications: [],
    },
  });

  const { data: options } = useQuery({
    queryKey: ['product-options'],
    queryFn: () => fetch('/api/products/options').then((res) => res.json()),
  });

  const mutation = useMutation({
    mutationFn: (data: Product) => {
      const url = isEdit ? `/api/products/${initialData.id}` : '/api/products';
      const method = isEdit ? 'PUT' : 'POST';
      return fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }).then((res) => res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success(
        isEdit ? 'محصول با موفقیت ویرایش شد' : 'محصول با موفقیت اضافه شد',
      );
      router.push('/dashboard/products');
    },
    onError: () => {
      toast.error('خطا در ذخیره محصول');
    },
  });

  const onSubmit = (data: Product) => {
    mutation.mutate(data);
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
      <Card>
        <CardHeader>
          <CardTitle>اطلاعات پایه</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Controller
              name="name"
              rules={{ required: 'نام محصول الزامی است' }}
              control={control}
              render={({ field, fieldState }) => (
                <Input
                  {...field}
                  id="name"
                  label="نام محصول"
                  error={fieldState.error?.message}
                />
              )}
            />
            <Controller
              name="slug"
              rules={{ required: 'نامک الزامی است' }}
              control={control}
              render={({ field, fieldState }) => (
                <Input
                  {...field}
                  id="slug"
                  label="نامک (Slug)"
                  error={fieldState.error?.message}
                />
              )}
            />
          </div>

          <Controller
            name="description"
            control={control}
            render={({ field: { ref, ...field } }) => (
              <Textarea {...field} id="description" label="توضیحات" rows={4} />
            )}
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <Controller
              name="category"
              rules={{ required: 'دسته‌بندی الزامی است' }}
              control={control}
              render={({ field, fieldState }) => (
                <div className="space-y-2">
                  <Label htmlFor="category">دسته‌بندی</Label>
                  <Select {...field} placeholder="انتخاب کنید">
                    {options?.categories?.map((cat: string) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </Select>
                  {fieldState.error && (
                    <p className="text-xs text-destructive">
                      {fieldState.error.message}
                    </p>
                  )}
                </div>
              )}
            />
            <Controller
              name="brand"
              rules={{ required: 'برند الزامی است' }}
              control={control}
              render={({ field, fieldState }) => (
                <div className="space-y-2">
                  <Label htmlFor="brand">برند</Label>
                  <Select {...field} placeholder="انتخاب کنید">
                    {options?.brands?.map((brand: string) => (
                      <SelectItem key={brand} value={brand}>
                        {brand}
                      </SelectItem>
                    ))}
                  </Select>
                  {fieldState.error && (
                    <p className="text-xs text-destructive">
                      {fieldState.error.message}
                    </p>
                  )}
                </div>
              )}
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={() => router.back()}>
          انصراف
        </Button>
        <Button disabled={mutation.isPending} type="submit">
          {mutation.isPending ? 'در حال ذخیره...' : 'ذخیره محصول'}
        </Button>
      </div>
    </form>
  );
}
