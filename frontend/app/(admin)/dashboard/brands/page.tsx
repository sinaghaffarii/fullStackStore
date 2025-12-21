/* eslint-disable max-lines-per-function */
'use client';

import { Plus, Search } from 'lucide-react';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

import type { CreateBrandDto } from '@/services/Brand';
import type { IBrand } from '@/types/brand';

import { Button } from '@/components/ui/Button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/Dialog';
import { ImageUploader } from '@/components/ui/ImageUploader';
import { Input } from '@/components/ui/Input';
import { useDialog } from '@/context/DialogContext';
import { useCreateBrandItem, useGetBrandList } from '@/services/Brand';

import { BrandsTable } from './BrandsTable';

export default function BrandsPage() {
  const { isOpen, setOpen, open } = useDialog();
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [filters, setFilters] = useState<{ name: string }>({
    name: '',
  });

  const { control, handleSubmit, reset, setValue, watch } = useForm<
    CreateBrandDto & { id?: string }
  >({
    defaultValues: {
      id: undefined,
      name: '',
      name_fa: '',
      slug: '',
      logo: '',
      is_active: true,
    },
  });

  const { mutate: upsertBrandItem, isPending: upsertBrandItemPending } =
    useCreateBrandItem();

  const { data: BrandsList, isLoading } = useGetBrandList({
    page,
    limit: +limit,
  });

  const brandId = watch('id');

  const handleEdit = (brand: IBrand) => {
    reset({
      id: brand.id,
      name: brand.name,
      name_fa: brand.name_fa,
      slug: brand.slug,
      logo: brand.logo,
      is_active: brand.is_active,
    });
    setOpen(true);
  };

  const handleCloseModal = () => {
    setOpen(false);
    reset({
      id: undefined,
      name: '',
      name_fa: '',
      slug: '',
      logo: '',
      is_active: true,
    });
  };

  const createBrandItemHandler = handleSubmit((data) => {
    upsertBrandItem(data, {
      onSuccess: () => {
        handleCloseModal();
      },
    });
  });

  return (
    <div className="space-y-6">
      {/* Modal Adding/Editing Brand */}
      <Dialog onOpenChange={setOpen} open={isOpen}>
        <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {brandId ? 'ویرایش برند' : 'ایجاد برند جدید'}
            </DialogTitle>
          </DialogHeader>

          {/* ✅ ImageUploader خارج از form */}
          <div className="mb-4">
            <Controller
              name="logo"
              rules={{ required: 'لوگو الزامی است' }}
              control={control}
              render={({ field, fieldState }) => (
                <div>
                  <ImageUploader
                    label="لوگوی برند"
                    value={field.value}
                    onChange={(url) => {
                      setValue('logo', url, {
                        shouldValidate: true,
                        shouldDirty: true,
                      });
                    }}
                  />
                  {fieldState.error && (
                    <p className="mt-1 text-sm text-destructive">
                      {fieldState.error.message}
                    </p>
                  )}
                </div>
              )}
            />
          </div>

          {/* ✅ Form فقط برای text fields */}
          <form className="space-y-4" onSubmit={createBrandItemHandler}>
            <Controller
              name="name"
              rules={{ required: 'نام برند الزامی است' }}
              control={control}
              render={({ field, fieldState }) => (
                <Input
                  {...field}
                  label="نام برند (English)"
                  error={fieldState.error?.message}
                  placeholder="مثال: BOBBY JONES"
                />
              )}
            />

            <Controller
              name="name_fa"
              rules={{ required: 'نام فارسی برند الزامی است' }}
              control={control}
              render={({ field, fieldState }) => (
                <Input
                  {...field}
                  label="نام برند (فارسی)"
                  error={fieldState.error?.message}
                  placeholder="مثال: بابی جونز"
                />
              )}
            />

            <Controller
              name="slug"
              control={control}
              render={({ field, fieldState }) => (
                <Input
                  {...field}
                  label="اسلاگ (Slug)"
                  error={fieldState.error?.message}
                  placeholder="مثال: bobby-jones"
                />
              )}
              rules={{
                required: 'اسلاگ الزامی است',
                pattern: {
                  value: /^[0-9a-z]+(?:-[0-9a-z]+)*$/,
                  message: 'فقط حروف کوچک، اعداد و خط تیره مجاز است',
                },
              }}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={handleCloseModal}
              >
                لغو
              </Button>
              <Button type="submit" loading={upsertBrandItemPending}>
                {brandId ? 'ویرایش برند' : 'ذخیره برند'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">مدیریت برند</h1>
          <p className="text-sm text-muted-foreground">
            {BrandsList?.data.pagination.total || 0} برند
          </p>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
        <div className="flex flex-col gap-4 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute top-1/2 right-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              className="pr-10 text-sm"
              value={filters.name}
              dimension="lg"
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, name: e.target.value }))
              }
              placeholder="جستجو در برند..."
            />
          </div>
        </div>

        <Button onClick={open}>
          <Plus className="ml-2 size-4" />
          افزودن برند
        </Button>
      </div>

      {/* Table */}
      <BrandsTable
        data={BrandsList?.data.items || []}
        page={page}
        pageSize={limit}
        isLoading={isLoading}
        onEdit={handleEdit}
        onPageChange={setPage}
        total={BrandsList?.data.pagination.total || 0}
      />
    </div>
  );
}
