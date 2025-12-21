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

export default function BrandsPage() {
  const { isOpen, setOpen, open } = useDialog();
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
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

  const { mutate: createBrandItem, isPending: createBrandItemPending } =
    useCreateBrandItem();
  const { mutate: upsertBrandItem, isPending: upsertBrandItemPending } =
    useUpsertBrandItem();

  const debouncedSetSearch = useMemo(
    () =>
      debounce((value: string) => {
        setDebouncedSearch(value);
        setPage(1);
      }, 1000),
    [],
  );

  useEffect(() => {
    debouncedSetSearch(searchInput);

    return () => {
      debouncedSetSearch.cancel();
    };
  }, [searchInput, debouncedSetSearch]);

  const { data: BrandsList, isLoading } = useGetBrandList({
    page,
    limit: +limit,
    search: debouncedSearch || undefined,
  });

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

  const onSubmit = handleSubmit((data) => {
    if (brandId) {
      const updateData: UpsertBrandDto = {
        id: data.id!,
        name: data.name,
        name_fa: data.name_fa,
        slug: data.slug,
        logo: data.logo,
        is_active: data.is_active,
      };

      upsertBrandItem(updateData, {
        onSuccess: () => {
          handleCloseModal();
        },
      });
    } else {
      const createData: CreateBrandDto = {
        name: data.name,
        name_fa: data.name_fa,
        slug: data.slug,
        logo: data.logo,
        is_active: data.is_active,
      };

      createBrandItem(createData, {
        onSuccess: () => {
          handleCloseModal();
        },
      });
    }
  });

  useEffect(() => {
    if (!isOpen) {
      reset({
        id: undefined,
        name: '',
        name_fa: '',
        slug: '',
        logo: '',
        is_active: true,
      });
    }
  }, [isOpen, reset]);

  return (
    <div className="space-y-6">
      <Dialog onOpenChange={setOpen} open={isOpen}>
        <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {brandId ? 'ویرایش برند' : 'ایجاد برند جدید'}
            </DialogTitle>
          </DialogHeader>

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
              <Button
                type="button"
                variant="outline"
                onClick={handleCloseModal}
              >
                لغو
              </Button>
              <Button
                type="submit"
                loading={createBrandItemPending || upsertBrandItemPending}
              >
                {brandId ? 'ویرایش برند' : 'ذخیره برند'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">مدیریت برند</h1>
          <p className="text-sm text-muted-foreground">
            {BrandsList?.data.pagination.total || 0} برند
          </p>
        </div>
      </div>

      <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
        <div className="flex flex-col gap-4 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute top-1/2 right-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              className="pr-10 text-sm"
              value={searchInput}
              dimension="lg"
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="جستجو در برند..."
            />
          </div>
        </div>

        <Button onClick={open}>
          <Plus className="ml-2 size-4" />
          افزودن برند
        </Button>
      </div>

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
