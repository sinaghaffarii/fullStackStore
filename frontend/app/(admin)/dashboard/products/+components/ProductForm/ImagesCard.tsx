/* eslint-disable next/no-img-element */
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';

import type { ProductFormType } from '@/validations';

import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

import { ImageUploadModal } from './ImageUploadModal';

export function ImagesCard() {
  const { control } = useFormContext<ProductFormType>();
  const { fields, append, update, remove } = useFieldArray({
    control,
    name: 'images',
  });

  const [modalOpen, setModalOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const handleOpenAdd = () => {
    setEditingIndex(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (index: number) => {
    setEditingIndex(index);
    setModalOpen(true);
  };

  const handleSave = (imageData: any) => {
    if (editingIndex === null) {
      append(imageData);
    } else {
      update(editingIndex, imageData);
    }
    setModalOpen(false);
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>تصاویر</CardTitle>
            <Button size="sm" variant="outline" onClick={handleOpenAdd}>
              <Plus className="ml-2 size-4" />
              افزودن تصویر
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {fields.length === 0 && (
            <p className="text-center text-muted-foreground">
              هیچ تصویری اضافه نشده است.
            </p>
          )}
          {fields.map((field, index) => (
            <div
              className="flex items-center gap-4 rounded-sm border p-2"
              key={field.id}
            >
              <img
                alt={field.alt || 'تصویر'}
                className="size-16 rounded-sm object-cover"
                src={
                  field.url
                    ? `${process.env.NEXT_PUBLIC_API_URL_IMAGE}${field.url}`
                    : '/images/products/defaultImage.jpg'
                }
              />
              <div className="flex-1">
                <p className="font-medium">{field.alt || 'بدون متن جایگزین'}</p>
                <Badge variant={field.is_primary ? 'default' : 'secondary'}>
                  {field.is_primary ? 'تصویر اصلی' : 'فرعی'}
                </Badge>
              </div>
              <Button
                size="icon"
                variant="outline"
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

      <ImageUploadModal
        defaultValues={editingIndex !== null ? fields[editingIndex] : undefined}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        open={modalOpen}
      />
    </>
  );
}
