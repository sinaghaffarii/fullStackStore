'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
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

  // const { fields, append, remove } = useFieldArray({
  //   control,
  //   name: 'specifications',
  // });

  const { data: options } = useQuery({
    queryKey: ['product-options'],
    queryFn: () => fetch('/api/products/options').then((res) => res.json()),
  });

  const mutation = useMutation({
    mutationFn: (data: any) => {
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

  const onSubmit = (data: any) => {
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
            <div className="space-y-2">
              <Label htmlFor="name">نام محصول *</Label>
              <Input
                id="name"
                {...register('name', { required: 'نام محصول الزامی است' })}
              />
              {errors.name && (
                <p className="text-xs text-destructive">
                  {errors.name.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="slug">نامک (Slug) *</Label>
              <Input
                id="slug"
                {...register('slug', { required: 'نامک الزامی است' })}
              />
              {errors.slug && (
                <p className="text-xs text-destructive">
                  {errors.slug.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">توضیحات</Label>
            <Textarea id="description" rows={4} {...register('description')} />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="category">دسته‌بندی *</Label>
              <Select
                {...register('category', { required: true })}
                placeholder="انتخاب کنید"
              >
                {options?.categories?.map((cat: string) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="brand">برند *</Label>
              <Select
                {...register('brand', { required: true })}
                placeholder="انتخاب کنید"
              >
                {options?.brands?.map((brand: string) => (
                  <SelectItem key={brand} value={brand}>
                    {brand}
                  </SelectItem>
                ))}
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ... بخش‌های دیگر فرم ... */}

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
