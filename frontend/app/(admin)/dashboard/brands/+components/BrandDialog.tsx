'use client';

import type { IBrand } from '@/types/brand';

import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/Dialog';

import { BrandForm } from './BrandForm';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  brand?: IBrand;
}

export function BrandDialog({ isOpen, onClose, brand }: Props) {
  return (
    <Dialog onOpenChange={onClose} open={isOpen}>
      <DialogContent className="max-h-[90vh] max-w-2xl">
        <DialogHeader>
          <DialogTitle>{brand ? 'ویرایش برند' : 'ایجاد برند جدید'}</DialogTitle>
        </DialogHeader>

        <DialogBody>
          <BrandForm brand={brand} onSuccess={onClose} />
        </DialogBody>
      </DialogContent>
    </Dialog>
  );
}
