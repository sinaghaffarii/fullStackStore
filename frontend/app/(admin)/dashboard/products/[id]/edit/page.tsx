'use client';

import { useParams } from 'next/navigation';

import { ProductForm } from '@/components/dashboard/products/ProductForm';
import { useGetProductById } from '@/services/Products';

export default function EditProductPage() {
  const params = useParams();
  const id = params.id as string;

  const { data, isLoading } = useGetProductById(id);

  if (isLoading) {
    return <div className="py-8 text-center">در حال بارگذاری...</div>;
  }

  if (!data?.data) {
    return <div className="py-8 text-center">محصول یافت نشد</div>;
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">ویرایش محصول</h1>
        <p className="text-sm text-muted-foreground">
          ویرایش اطلاعات {data.data.name}
        </p>
      </div>
      <ProductForm initialData={data.data} />
    </div>
  );
}
