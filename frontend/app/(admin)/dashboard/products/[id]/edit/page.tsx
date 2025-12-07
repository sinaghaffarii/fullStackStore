'use client';

import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';

import { ProductForm } from '@/components/dashboard/products/ProductForm';

export default function EditProductPage() {
  const params = useParams();
  const id = params.id as string;

  const { data: product, isLoading } = useQuery({
    queryKey: ['product', id],
    queryFn: () => fetch(`/api/products/${id}`).then((res) => res.json()),
  });

  if (isLoading) {
    return <div className="py-8 text-center">در حال بارگذاری...</div>;
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">ویرایش محصول</h1>
        <p className="text-sm text-muted-foreground">
          ویرایش اطلاعات {product?.name}
        </p>
      </div>
      <ProductForm initialData={product} />
    </div>
  );
}
