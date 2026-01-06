'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';

import type { Product } from '@/types/product';

import { useCreateProduct, useUpdateProduct } from '@/services/Products';

import type { ProductFormData } from './schema';

import { BasicInfoCard } from './BasicInfoCard';
import { FormActions } from './FormAction';
import { ImagesCard } from './ImagesCard';
import { productSchema } from './schema';
import { VariantsCard } from './Variants';

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

  const form = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: getDefaultValues(initialData),
  });

  const handleSuccess = () => router.push('/dashboard/products');

  const onSubmit = (data: ProductFormData) => {
    if (isEdit && initialData) {
      updateProduct(
        { id: initialData.id, dto: data as any },
        { onSuccess: handleSuccess },
      );
    } else {
      createProduct(data as any, { onSuccess: handleSuccess });
    }
  };

  return (
    <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
      <BasicInfoCard control={form.control} errors={form.formState.errors} />
      <VariantsCard control={form.control} />
      <ImagesCard control={form.control} />
      <FormActions
        isLoading={createPending || updatePending}
        onCancel={() => router.back()}
      />
    </form>
  );
}

function getDefaultValues(initialData?: Product): ProductFormData {
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
    variants: mapVariants(initialData.variants),
    images: mapImages(initialData.images),
  };
}

function mapVariants(variants?: Product['variants']) {
  if (!variants || variants.length === 0) {
    return [{ sku: '', name: '', stock: 0 }];
  }

  return variants.map((v) => ({
    sku: v.sku || '',
    name: v.name || '',
    stock: v.stock || 0,
  }));
}

function mapImages(images?: Product['images']) {
  if (!images || images.length === 0) {
    return [{ url: '', is_primary: true }];
  }

  return images.map((img) => ({
    url: img.url || '',
    is_primary: img.is_primary || false,
  }));
}
