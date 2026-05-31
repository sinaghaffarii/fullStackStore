'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { FormProvider, useForm } from 'react-hook-form';

import type { CreateProductDto, EnrichedProduct } from '@/types/product';
import type { ProductFormType } from '@/validations';

import { useCreateProduct, useUpdateProduct } from '@/services/Products';
import { ProductStatus } from '@/types/product';
import { ROUTE_OBJECT } from '@/utils/constants';
import { productSchema } from '@/validations/product';

import { BasicInfoCard } from './BasicInfoCard';
import { FormActions } from './FormAction';
import { ImagesCard } from './ImagesCard';
import { VariantsCard } from './Variant';

interface Props {
  initialData?: EnrichedProduct;
}

function mapEnrichedToForm(product: EnrichedProduct): ProductFormType {
  return {
    name: product.name,
    slug: product.slug,
    description: product.description || '',
    base_price: product.base_price,
    category_id: product.category?.id || '',
    brand_id: product.brand?.id || '',
    tags: product.tags || [],
    specifications: product.specifications || {},
    is_featured: product.is_featured,
    is_new: product.is_new,
    status: product.status,
    variants: (product.variants || []).map((v) => ({
      name: v.name,
      stock: v.stock,
      price: v.price,
      compare_price: v.compare_price ?? null,
      options: v.options || [],
      image_url: v.image_url || '',
    })),
    images: (product.images || []).map((img) => ({
      url: img.url,
      alt: img.alt,
      is_primary: (img as any).is_primary ?? false,
    })),
  };
}

function mapFormToCreateDto(data: ProductFormType): CreateProductDto {
  return {
    name: data.name,
    slug: data.slug,
    description: data.description,
    base_price: data.base_price ?? 0,
    category_id: data.category_id,
    brand_id: data.brand_id,
    tags: data.tags,
    specifications: data.specifications, // مستقیماً Record<string, string>
    is_featured: data.is_featured,
    is_new: data.is_new,
    status: data.status,
    variants: data.variants.map((v) => ({
      name: v.name,
      stock: v.stock ?? 0,
      price: v.price ?? 0,
      compare_price: v.compare_price ?? 0,
      options: v.options || [],
      image_url: v.image_url,
    })),
    images: data.images.map((img, idx) => ({
      url: img.url,
      alt: img.alt,
      is_primary: img.is_primary ?? idx === 0,
      sort_order: idx,
    })),
  };
}

const DEFAULT_VALUES = {
  name: '',
  slug: '',
  description: '',
  base_price: undefined,
  category_id: '',
  brand_id: '',
  tags: [],
  specifications: {},
  is_featured: false,
  is_new: true,
  status: ProductStatus.ACTIVE,
  variants: [],
  images: [],
} as ProductFormType;

export function ProductForm({ initialData }: Props) {
  const router = useRouter();
  const isEdit = !!initialData;

  const { mutate: createProduct, isPending: createPending } =
    useCreateProduct();
  const { mutate: updateProduct, isPending: updatePending } =
    useUpdateProduct();

  const methods = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: initialData
      ? mapEnrichedToForm(initialData)
      : DEFAULT_VALUES,
  });

  const onSubmit = methods.handleSubmit((formData) => {
    const dto = mapFormToCreateDto(formData);
    if (isEdit && initialData?.id) {
      updateProduct(
        { id: initialData.id, dto },
        { onSuccess: () => router.push(ROUTE_OBJECT.D_PRODUCTS) },
      );
    } else {
      createProduct(dto, {
        onSuccess: () => router.push(ROUTE_OBJECT.D_PRODUCTS),
      });
    }
  });

  return (
    <FormProvider {...methods}>
      <form className="space-y-6" onSubmit={onSubmit}>
        <BasicInfoCard />
        <VariantsCard />
        <ImagesCard />
        <FormActions
          isLoading={createPending || updatePending}
          onCancel={() => router.back()}
        />
      </form>
    </FormProvider>
  );
}
