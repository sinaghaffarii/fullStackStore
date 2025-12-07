'use client';

import { CategoryForm } from '@/components/dashboard/categories/CategoryForm';

export default function AddCategoryPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">افزودن دسته‌بندی جدید</h1>
        <p className="text-sm text-muted-foreground">
          اطلاعات دسته‌بندی را وارد کنید
        </p>
      </div>
      <CategoryForm />
    </div>
  );
}
