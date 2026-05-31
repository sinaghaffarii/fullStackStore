/* eslint-disable max-lines */
'use client';

import React, { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';

import type { CreateCategoryDto, UpsertCategoryDto } from '@/services/Category';
import type { ICategory } from '@/types/category';

import { CategoryTreeSelector } from '@/components/dashboard/categories/CategoryTreeSelector';
import { Button } from '@/components/ui/Button';
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/Dialog';
import { BaseInput } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Switch } from '@/components/ui/Switch';
import { Textarea } from '@/components/ui/Textarea';
import {
  useCreateCategoryItem,
  useUpsertCategoryItem,
} from '@/services/Category';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  category?: ICategory;
  treeCategories: any[];
}

const defaultFormValues: CreateCategoryDto & { id?: string } = {
  id: undefined,
  name: '',
  slug: '',
  description: '',
  is_active: true,
  parent_id: null,
  sort_order: 0,
};

const CategoryForm = ({ isOpen, onClose, category, treeCategories }: Props) => {
  const { control, handleSubmit, reset, watch } = useForm<
    CreateCategoryDto & { id?: string }
  >({
    defaultValues: defaultFormValues,
  });

  useEffect(() => {
    if (category?.id) {
      reset(category);
    }
  }, [category]);

  const { mutate: create, isPending: creating } = useCreateCategoryItem();
  const { mutate: update, isPending: updating } = useUpsertCategoryItem();

  const handleClose = () => {
    onClose();
    reset(defaultFormValues);
  };

  const onSubmit = handleSubmit((formData) => {
    const callbacks = { onSuccess: handleClose };

    if (formData.id) {
      const payload: UpsertCategoryDto = {
        id: formData.id,
        name: formData.name,
        slug: formData.slug,
        description: formData.description || '',
        is_active: formData.is_active,
        parent_id: formData.parent_id,
        sort_order: formData.sort_order || 0,
      };
      update(payload, callbacks);
    } else {
      const payload: CreateCategoryDto = {
        name: formData.name,
        slug: formData.slug,
        description: formData.description || '',
        is_active: formData.is_active,
        parent_id: formData.parent_id,
        sort_order: formData.sort_order,
      };
      create(payload, callbacks);
    }
  });

  const isPending = creating || updating;

  return (
    <Dialog onOpenChange={(open) => !open && handleClose()} open={isOpen}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>
            {category ? 'ویرایش دسته‌بندی' : 'ایجاد دسته‌بندی'}
          </DialogTitle>
        </DialogHeader>

        <DialogBody>
          <form className="space-y-4" id="category-form" onSubmit={onSubmit}>
            <Controller
              name="parent_id"
              control={control}
              render={({ field }) => (
                <CategoryTreeSelector
                  excludeId={category?.id}
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
              render={({ field: { ref, ...fieldWithoutRef }, fieldState }) => (
                <BaseInput
                  {...fieldWithoutRef}
                  label="نام دسته‌بندی"
                  error={fieldState.error?.message}
                />
              )}
            />

            <Controller
              name="slug"
              control={control}
              render={({ field: { ref, ...fieldWithoutRef }, fieldState }) => (
                <BaseInput
                  {...fieldWithoutRef}
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
              render={({ field: { ref, ...fieldWithoutRef } }) => (
                <Textarea {...fieldWithoutRef} label="توضیحات" rows={3} />
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
          </form>
        </DialogBody>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={handleClose}>
            لغو
          </Button>
          <Button type="submit" form="category-form" loading={isPending}>
            ذخیره
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default React.memo(CategoryForm);
