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

interface FormData {
  title: string;
  description: string;
}

export function CategoryForm({ initialData }: Props) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const isEdit = !!initialData;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      title: initialData?.title || '',
      description: initialData?.description || '',
    },
  });

  const mutation = useMutation({
    mutationFn: (data: FormData) => {
      const url = isEdit
        ? `/api/categories/${initialData.title}`
        : '/api/categories';
      const method = isEdit ? 'PUT' : 'POST';
      return fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }).then((res) => {
        if (!res.ok) throw new Error('خطا در ذخیره دسته‌بندی');
        return res.json();
      });
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
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : 'خطا در ذخیره دسته‌بندی',
      );
    },
  });

  const onSubmit = (data: FormData) => {
    mutation.mutate(data);
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
      <Card>
        <CardHeader>
          <CardTitle>اطلاعات دسته‌بندی</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">
              عنوان دسته‌بندی <span className="text-destructive">*</span>
            </Label>
            <Input
              disabled={isEdit} // در حالت ویرایش، عنوان قابل تغییر نیست
              id="title"
              error={errors.title?.message}
              placeholder="مثال: لپ‌تاپ"
              {...register('title', {
                required: 'عنوان دسته‌بندی الزامی است',
                minLength: {
                  value: 2,
                  message: 'عنوان باید حداقل ۲ کاراکتر باشد',
                },
                maxLength: {
                  value: 50,
                  message: 'عنوان نباید بیشتر از ۵۰ کاراکتر باشد',
                },
              })}
            />
            {isEdit && (
              <p className="text-xs text-muted-foreground">
                عنوان دسته‌بندی قابل تغییر نیست
              </p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">توضیحات</Label>
            <Textarea
              id="description"
              placeholder="توضیحات کوتاهی درباره این دسته‌بندی..."
              rows={5}
              {...register('description', {
                maxLength: {
                  value: 500,
                  message: 'توضیحات نباید بیشتر از ۵۰۰ کاراکتر باشد',
                },
              })}
            />
            {errors.description && (
              <p className="text-xs text-destructive">
                {errors.description.message}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-end gap-4">
        <Button
          disabled={mutation.isPending}
          type="button"
          variant="outline"
          onClick={() => router.back()}
        >
          انصراف
        </Button>
        <Button disabled={mutation.isPending} type="submit">
          {mutation.isPending
            ? 'در حال ذخیره...'
            : isEdit
              ? 'ویرایش دسته‌بندی'
              : 'افزودن دسته‌بندی'}
        </Button>
      </div>
    </form>
  );
}
