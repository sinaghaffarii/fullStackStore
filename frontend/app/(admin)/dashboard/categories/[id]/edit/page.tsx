'use client';

import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';

import { CategoryForm } from '@/components/dashboard/categories/CategoryForm';

export default function EditCategoryPage() {
  const params = useParams();
  const id = params.id as string;

  const { data: category, isLoading } = useQuery({
    queryKey: ['category', id],
    queryFn: () => fetch(`/api/categories/${id}`).then((res) => res.json()),
  });

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <div className="size-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="mt-4 text-sm text-muted-foreground">
            در حال بارگذاری...
          </p>
        </div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <p className="text-lg font-semibold">دسته‌بندی یافت نشد</p>
          <p className="mt-2 text-sm text-muted-foreground">
            دسته‌بندی مورد نظر حذف شده یا وجود ندارد
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">ویرایش دسته‌بندی</h1>
        <p className="text-sm text-muted-foreground">
          ویرایش اطلاعات «{category.title}»
        </p>
      </div>
      <CategoryForm initialData={category} />
    </div>
  );
}
