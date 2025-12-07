'use client';

import { ProductForm } from '@/components/dashboard/products/ProductForm';

export default function AddProductPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">افزودن محصول جدید</h1>
        <p className="text-sm text-muted-foreground">
          اطلاعات محصول را وارد کنید
        </p>
      </div>
      <ProductForm />
    </div>
  );
}
