/* eslint-disable max-lines-per-function */
'use client';

import { debounce } from 'lodash';
import { Plus, Search } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

import type { CreateBrandDto, UpsertBrandDto } from '@/services/Brand';
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
import { Label } from '@/components/ui/Label';
import { Switch } from '@/components/ui/Switch';
import { useDialog } from '@/context/DialogContext';
import {
  useCreateBrandItem,
  useGetBrandList,
  useUpsertBrandItem,
} from '@/services/Brand';

import { BrandsTable } from './BrandsTable';

const DEFAULT_LIMIT = 10;

export default function BrandsPage() {
  const { isOpen, setOpen, open } = useDialog();

  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

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

  const brandId = watch('id');

  const { mutate: createBrand, isPending: creating } = useCreateBrandItem();
  const { mutate: upsertBrand, isPending: updating } = useUpsertBrandItem();

  const debounceSearch = useMemo(
    () =>
      debounce((value: string) => {
        setDebouncedSearch(value);
        setPage(1);
      }, 1000),
    [],
  );

  useEffect(() => {
    debounceSearch(searchInput);
    return () => debounceSearch.cancel();
  }, [searchInput, debounceSearch]);

  const { data, isLoading } = useGetBrandList({
    page,
    limit: DEFAULT_LIMIT,
    search: debouncedSearch || undefined,
  });

  const items = data?.data.items ?? [];
  const pagination = data?.data.pagination;

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

  const closeModal = () => {
    setOpen(false);
    reset();
  };

  const onSubmit = handleSubmit((formData) => {
    if (brandId) {
      const payload: UpsertBrandDto = {
        id: brandId,
        name: formData.name,
        name_fa: formData.name_fa,
        slug: formData.slug,
        logo: formData.logo,
        is_active: formData.is_active,
      };
      upsertBrand(payload, { onSuccess: closeModal });
    } else {
      const payload: CreateBrandDto = {
        name: formData.name,
        name_fa: formData.name_fa,
        slug: formData.slug,
        logo: formData.logo,
        is_active: formData.is_active,
      };
      createBrand(payload, { onSuccess: closeModal });
    }
  });

  return (
    <div className="space-y-6">
      {/* Modal */}
      <Dialog onOpenChange={setOpen} open={isOpen}>
        <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {brandId ? 'ویرایش برند' : 'ایجاد برند جدید'}
            </DialogTitle>
          </DialogHeader>

          <Controller
            name="logo"
            rules={{ required: 'لوگو الزامی است' }}
            control={control}
            render={({ field, fieldState }) => (
              <div>
                <ImageUploader
                  label="لوگوی برند"
                  value={field.value ?? undefined}
                  onChange={(url) =>
                    setValue('logo', url, {
                      shouldValidate: true,
                      shouldDirty: true,
                    })
                  }
                />
                {fieldState.error && (
                  <p className="mt-1 text-sm text-destructive">
                    {fieldState.error.message}
                  </p>
                )}
              </div>
            )}
          />

          <form className="space-y-4" onSubmit={onSubmit}>
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

            <Controller
              name="is_active"
              control={control}
              render={({ field }) => (
                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <Label
                      className="text-base font-medium"
                      htmlFor="is_active"
                    >
                      وضعیت برند
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      برند فعال در سایت نمایش داده می‌شود
                    </p>
                  </div>
                  <Switch
                    checked={field.value}
                    id="is_active"
                    onCheckedChange={field.onChange}
                  />
                </div>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={closeModal}>
                لغو
              </Button>
              <Button type="submit" loading={creating || updating}>
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
            {pagination?.total ?? 0} برند
          </p>
        </div>

        <Button onClick={open}>
          <Plus className="ml-2 size-4" />
          افزودن برند
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute top-1/2 right-3 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          className="pr-10"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="جستجو در برند…"
        />
      </div>

      {/* Table */}
      <BrandsTable
        data={items}
        page={page}
        pageSize={DEFAULT_LIMIT}
        isLoading={isLoading}
        onEdit={handleEdit}
        onPageChange={setPage}
        total={pagination?.total ?? 0}
      />
    </div>
  );
}
