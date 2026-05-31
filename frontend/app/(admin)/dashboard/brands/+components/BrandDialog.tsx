'use client';

import type { IBrand } from '@/types/brand';

import { Button } from '@/components/ui/Button';
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/Dialog';
import { useCreateBrandItem, useUpsertBrandItem } from '@/services/Brand';

import { BrandForm } from './BrandForm';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  brand?: IBrand;
}

export function BrandDialog({ isOpen, onClose, brand }: Props) {
  const { isPending: creating } = useCreateBrandItem();
  const { isPending: updating } = useUpsertBrandItem();
  return (
    <Dialog onOpenChange={onClose} open={isOpen}>
      <DialogContent className="max-h-[90vh] max-w-2xl">
        <DialogHeader>
          <DialogTitle>{brand ? 'ویرایش برند' : 'ایجاد برند جدید'}</DialogTitle>
        </DialogHeader>

        <DialogBody>
          <BrandForm brand={brand} onSuccess={onClose} />
        </DialogBody>
        <DialogFooter>
          <Button type="submit" loading={creating || updating}>
            {brand ? 'ویرایش برند' : 'ذخیره برند'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
