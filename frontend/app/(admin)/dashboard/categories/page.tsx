/* eslint-disable max-lines-per-function */
'use client';

import { debounce } from 'lodash';
import { GitBranch, Plus, Search } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

import type { CreateCategoryDto, UpsertCategoryDto } from '@/services/Category';
import type { ICategory } from '@/types/category';

import { CategoriesTable } from '@/components/dashboard/categories/CategoriesTable';
import { CategoryTreePreview } from '@/components/dashboard/categories/CategoryTreePreview';
import { CategoryTreeSelector } from '@/components/dashboard/categories/CategoryTreeSelector';
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
import { Textarea } from '@/components/ui/Textarea';
import {
  useCreateCategoryItem,
  useGetCategoryHierarchy,
  useGetCategoryList,
  useUpsertCategoryItem,
} from '@/services/Category';

const DEFAULT_LIMIT = 20;

const defaultFormValues: CreateCategoryDto & { id?: string } = {
  id: undefined,
  name: '',
  slug: '',
  description: '',
  image: null,
  is_active: true,
  parent_id: null,
  sort_order: 0,
};

export default function CategoriesPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isTreeOpen, setIsTreeOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  const { control, handleSubmit, reset, setValue, watch } = useForm<
    CreateCategoryDto & { id?: string }
  >({
    defaultValues: defaultFormValues,
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
    includeChildren: false,
    search: debouncedSearch || undefined,
  });

  const { data: hierarchyData } = useGetCategoryHierarchy();

  const { mutate: createCategory, isPending: creating } =
    useCreateCategoryItem();
  const { mutate: upsertCategory, isPending: updating } =
    useUpsertCategoryItem();

  const items = data?.data.items ?? [];
  const pagination = data?.data.pagination;
  const treeCategories = hierarchyData?.data ?? [];

  const resetForm = useCallback(() => {
    reset(defaultFormValues);
  }, [reset]);

  const handleEdit = (category: ICategory) => {
    reset({
      id: category.id,
      name: category.name,
      slug: category.slug,
      description: category.description || '',
      image: category.image,
      is_active: category.is_active,
      parent_id: category.parent_id,
      sort_order: category.sort_order || 0,
    });
    setIsFormOpen(true);
  };

  const closeFormModal = useCallback(() => {
    setIsFormOpen(false);
    resetForm();
  }, [resetForm]);

  const handleFormOpenChange = useCallback(
    (isDialogOpen: boolean) => {
      setIsFormOpen(isDialogOpen);
      if (!isDialogOpen) {
        resetForm();
      }
    },
    [resetForm],
  );

  const onSubmit = handleSubmit((formData) => {
    if (categoryId) {
      const payload: UpsertCategoryDto = {
        id: categoryId,
        name: formData.name,
        slug: formData.slug,
        description: formData.description || '',
        image: formData.image,
        is_active: formData.is_active,
        parent_id: formData.parent_id,
        sort_order: formData.sort_order || 0,
      };
      upsertCategory(payload, { onSuccess: closeFormModal });
    } else {
      const payload: CreateCategoryDto = {
        name: formData.name,
        slug: formData.slug,
        description: formData.description || '',
        image: formData.image,
        is_active: formData.is_active,
        parent_id: formData.parent_id,
        sort_order: formData.sort_order,
      };
      createCategory(payload, { onSuccess: closeFormModal });
    }
  });

  return (
    <div className="space-y-6">
      <Dialog onOpenChange={handleFormOpenChange} open={isFormOpen}>
        <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto">
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
              name="parent_id"
              control={control}
              render={({ field }) => (
                <CategoryTreeSelector
                  excludeId={categoryId}
                  value={field.value}
                  categories={treeCategories}
                  onChange={field.onChange}
                />
              )}
            />

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
              control={control}
              render={({ field: { ref, ...field } }) => (
                <Textarea {...field} label="توضیحات" rows={3} />
              )}
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
              <Button type="button" variant="outline" onClick={closeFormModal}>
                لغو
              </Button>
              <Button type="submit" loading={creating || updating}>
                ذخیره
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog onOpenChange={setIsTreeOpen} open={isTreeOpen}>
        <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <GitBranch className="size-5" />
              ساختار درختی دسته‌بندی‌ها
            </DialogTitle>
          </DialogHeader>

          {treeCategories.length > 0 ? (
            <CategoryTreePreview categories={treeCategories} />
          ) : (
            <div className="py-12 text-center text-muted-foreground">
              هنوز دسته‌بندی‌ای ایجاد نشده است
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsTreeOpen(false)}>
              بستن
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">مدیریت دسته‌بندی‌ها</h1>
          <p className="text-sm text-muted-foreground">
            {pagination?.total ?? 0} دسته‌بندی
          </p>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setIsTreeOpen(true)}>
            <GitBranch className="ml-2 size-4" />
            نمایش ساختار
          </Button>
          <Button onClick={() => setIsFormOpen(true)}>
            <Plus className="ml-2 size-4" />
            افزودن دسته‌بندی
          </Button>
        </div>
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
