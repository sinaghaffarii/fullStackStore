'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

import type { CategoryData } from '@/types/product';

import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Textarea } from '@/components/ui/Textarea';

interface Props {
  initialData?: CategoryData;
}

export function CategoryForm({ initialData }: Props) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const isEdit = !!initialData;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: initialData || {
      title: '',
      description: '',
    },
  });

  const mutation = useMutation({
    mutationFn: (data: any) => {
      const url = isEdit
        ? `/api/categories/${initialData.title}`
        : '/api/categories';
      const method = isEdit ? 'PUT' : 'POST';
      return fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }).then((res) => res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success(
        isEdit
          ? 'دسته‌بندی با موفقیت ویرایش شد'
          : 'دسته‌بندی با موفقیت اضافه شد',
      );
      router.push('/dashboard/categories');
    },
    onError: () => {
      toast.error('خطا در ذخیره دسته‌بندی');
    },
  });

  const onSubmit = (data: any) => {
    mutation.mutate(data);
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
      <Card>
        <CardHeader>
          <CardTitle>اطلاعات دسته‌بندی</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">عنوان دسته‌بندی *</Label>
            <Input
              id="title"
              {...register('title', { required: 'عنوان الزامی است' })}
              disabled={isEdit}
              error={errors.title?.message}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">توضیحات</Label>
            <Textarea id="description" rows={4} {...register('description')} />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={() => router.back()}>
          انصراف
        </Button>
        <Button disabled={mutation.isPending} type="submit">
          {mutation.isPending ? 'در حال ذخیره...' : 'ذخیره دسته‌بندی'}
        </Button>
      </div>
    </form>
  );
}
