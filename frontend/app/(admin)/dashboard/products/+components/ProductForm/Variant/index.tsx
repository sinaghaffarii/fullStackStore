/* eslint-disable next/no-img-element */
'use client';

import { Pencil, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';

import type { ProductFormType } from '@/validations';

import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { VariantOptionType } from '@/types/product';

import { VariantModal } from './VariantModal';

export function VariantsCard() {
  const { control } = useFormContext<ProductFormType>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'variants',
  });

  const [modalOpen, setModalOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const handleOpenAdd = () => {
    append({
      name: '',
      stock: undefined,
      price: undefined,
      compare_price: undefined,
      image_url: '',
      options: [{ type: VariantOptionType.COLOR, label: '', value: '' }],
    });
    setEditingIndex(fields.length);
    setModalOpen(true);
  };

  const handleOpenEdit = (index: number) => {
    setEditingIndex(index);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditingIndex(null);
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>واریانت‌ها</CardTitle>
            <Button size="sm" variant="outline" onClick={handleOpenAdd}>
              <Plus className="ml-2 size-4" />
              افزودن واریانت
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {fields.length === 0 && (
            <p className="text-center text-muted-foreground">
              هیچ واریانتی اضافه نشده است.
            </p>
          )}
          {fields.map((field, index) => (
            <div
              className="flex items-center gap-4 rounded-lg border p-4"
              key={field.id}
            >
              {field.image_url && (
                <img
                  alt={field.name}
                  className="size-16 rounded-sm object-cover"
                  src={`${process.env.NEXT_PUBLIC_API_URL_IMAGE}${field.image_url}`}
                />
              )}
              <div className="flex-1">
                <p className="font-medium">{field.name || 'نامشخص'}</p>
                <p className="text-sm text-muted-foreground">
                  موجودی: {field.stock} | قیمت: {field.price} تومان
                  {field.compare_price &&
                    ` (قبلی: ${field.compare_price} تومان)`}
                </p>
                {field.options && field.options?.length > 0 && (
                  <div className="mt-1 flex flex-wrap gap-2">
                    {field.options.map((opt) => (
                      <span
                        className="rounded-md bg-secondary px-2 py-1 text-xs"
                        key={opt.value}
                      >
                        {opt.type}: {opt.label}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => handleOpenEdit(index)}
              >
                <Pencil className="size-4" />
              </Button>
              <Button size="icon" variant="ghost" onClick={() => remove(index)}>
                <Trash2 className="size-4" />
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      {modalOpen && editingIndex !== null && (
        <VariantModal
          variantIndex={editingIndex}
          onClose={handleCloseModal}
          open={modalOpen}
        />
      )}
    </>
  );
}
