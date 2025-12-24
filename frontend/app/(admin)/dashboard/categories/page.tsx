/* eslint-disable max-lines-per-function */
'use client';

import { debounce } from 'lodash';
import { Plus, Search } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

import type { CreateCategoryDto, UpsertCategoryDto } from '@/services/Category';
import type { ICategory } from '@/types/category';

import { CategoriesTable } from '@/components/dashboard/categories/CategoriesTable';
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
  useCreateCategoryItem,
  useGetCategoryList,
  useUpsertCategoryItem,
} from '@/services/Category';

const DEFAULT_LIMIT = 20;

export default function CategoriesPage() {
  const { isOpen, setOpen, open } = useDialog();

  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  const { control, handleSubmit, reset, setValue, watch } = useForm<
    CreateCategoryDto & { id?: string }
  >({
    defaultValues: {
      id: undefined,
      name: '',
      slug: '',
      description: '',
      image: '',
      is_active: true,
      parent_id: null,
    },
  });

  const categoryId = watch('id');

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

  const { data, isLoading } = useGetCategoryList({
    page,
    limit: DEFAULT_LIMIT,
    includeChildren: true,
    search: debouncedSearch || undefined,
  });

  const { mutate: createCategory, isPending: creating } =
    useCreateCategoryItem();
  const { mutate: upsertCategory, isPending: updating } =
    useUpsertCategoryItem();

  const handleEdit = (category: ICategory) => {
    reset({
      id: category.id,
      name: category.name,
      slug: category.slug,
      description: category.description || '',
      image: category.image || '',
      is_active: category.is_active,
      parent_id: category.parent_id,
    });
    setOpen(true);
  };

  const closeModal = () => {
    reset({
      id: undefined,
      name: '',
      slug: '',
      description: '',
      image: '',
      is_active: true,
      parent_id: null,
    });
    setOpen(false);
  };

  const onSubmit = handleSubmit((formData) => {
    if (categoryId) {
      const payload: UpsertCategoryDto = {
        id: categoryId,
        name: formData.name,
        slug: formData.slug,
        description: formData.description,
        image: formData.image,
        is_active: formData.is_active,
        parent_id: formData.parent_id,
      };
      upsertCategory(payload, { onSuccess: closeModal });
    } else {
      const payload: CreateCategoryDto = {
        name: formData.name,
        slug: formData.slug,
        description: formData.description,
        image: formData.image,
        is_active: formData.is_active,
        parent_id: formData.parent_id,
      };
      createCategory(payload, { onSuccess: closeModal });
    }
  });

  return (
    <div className="space-y-6">
      <Dialog onOpenChange={setOpen} open={isOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {categoryId ? 'ویرایش دسته‌بندی' : 'ایجاد دسته‌بندی'}
            </DialogTitle>
          </DialogHeader>

          <Controller
            name="image"
            control={control}
            render={({ field }) => (
              <ImageUploader
                label="تصویر دسته‌بندی"
                value={field.value ?? undefined}
                onChange={(url) =>
                  setValue('image', url, { shouldDirty: true })
                }
              />
            )}
          />

          <form className="space-y-4" onSubmit={onSubmit}>
            <Controller
              name="name"
              rules={{ required: 'نام الزامی است' }}
              control={control}
              render={({ field, fieldState }) => (
                <Input
                  {...field}
                  label="نام دسته‌بندی"
                  error={fieldState.error?.message}
                />
              )}
            />

            <Controller
              name="slug"
              control={control}
              render={({ field, fieldState }) => (
                <Input
                  {...field}
                  label="Slug"
                  error={fieldState.error?.message}
                />
              )}
              rules={{
                required: 'اسلاگ الزامی است',
                pattern: {
                  value: /^[0-9a-z]+(?:-[0-9a-z]+)*$/,
                  message: 'اسلاگ معتبر نیست',
                },
              }}
            />

            <Controller
              name="description"
              render={({ field }) => <Input {...field} label="توضیحات" />}
              control={control}
            />

            <Controller
              name="is_active"
              control={control}
              render={({ field }) => (
                <div className="flex items-center justify-between rounded-lg border p-4">
                  <Label>وضعیت فعال</Label>
                  <Switch
                    checked={field.value}
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
                ذخیره
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Header + Search + Table same as Brand */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">مدیریت دسته‌بندی‌ها</h1>
          <p className="text-sm text-muted-foreground">
            {data?.data.pagination.total ?? 0} دسته‌بندی
          </p>
        </div>

        <Button onClick={open}>
          <Plus className="ml-2 size-4" />
          افزودن دسته‌بندی
        </Button>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute top-1/2 right-3 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          className="pr-10"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="جستجو در دسته‌بندی‌ها…"
        />
      </div>

      <CategoriesTable
        data={data?.data.items || []}
        page={page}
        pageSize={DEFAULT_LIMIT}
        isLoading={isLoading}
        onEdit={handleEdit}
        onPageChange={setPage}
        total={data?.data.pagination.total ?? 0}
      />
    </div>
  );
}
