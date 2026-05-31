'use client';

import { useFormContext } from 'react-hook-form';

import type { ProductFormType } from '@/validations';

import { Button } from '@/components/ui/Button';
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/Dialog';

import { VariantFormFields } from './VariantFormFields';

interface Props {
  open: boolean;
  variantIndex: number;
  onClose: () => void;
}

export function VariantModal({ open, variantIndex, onClose }: Props) {
  const { watch, trigger } = useFormContext<ProductFormType>();
  const variantName = watch(`variants.${variantIndex}.name`);

  const handleSave = async () => {
    const isValid = await trigger(`variants.${variantIndex}`);
    if (!isValid) return;

    onClose();
  };

  return (
    <Dialog onOpenChange={onClose} open={open}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {variantName ? 'ویرایش واریانت' : 'افزودن واریانت'}
          </DialogTitle>
        </DialogHeader>
        <DialogBody>
          <div className="space-y-6">
            <VariantFormFields variantIndex={variantIndex} />
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={onClose}>
                لغو
              </Button>
              <Button type="button" onClick={handleSave}>
                ذخیره
              </Button>
            </div>
          </div>
        </DialogBody>
      </DialogContent>
    </Dialog>
  );
}
