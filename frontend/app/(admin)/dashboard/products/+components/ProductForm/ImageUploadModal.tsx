import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { Controller, FormProvider, useForm, useWatch } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/Button';
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/Dialog';
import { ImageUploader } from '@/components/ui/ImageUploader';
import { BaseInput } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Switch } from '@/components/ui/Switch';

const imageSchema = z.object({
  url: z.string().min(1, 'آدرس تصویر الزامی است'),
  alt: z.string().optional(),
  is_primary: z.boolean().default(false),
});

type ImageFormData = z.infer<typeof imageSchema>;

interface Props {
  open: boolean;
  defaultValues?: Partial<ImageFormData>;
  onSave: (data: ImageFormData) => void;
  onClose: () => void;
}

export function ImageUploadModal({
  open,
  defaultValues,
  onSave,
  onClose,
}: Props) {
  const methods = useForm({
    resolver: zodResolver(imageSchema),
    defaultValues: {
      url: '',
      alt: '',
      is_primary: false,
    },
  });

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = methods;

  const urlValue = useWatch({ control, name: 'url' });

  useEffect(() => {
    if (open) {
      reset({
        url: defaultValues?.url || '',
        alt: defaultValues?.alt || '',
        is_primary: defaultValues?.is_primary ?? false,
      });
    }
  }, [open, defaultValues, reset]);

  const onSubmit = (data: ImageFormData) => {
    onSave(data);
    onClose();
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Dialog onOpenChange={handleClose} open={open}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {defaultValues?.url ? 'ویرایش تصویر' : 'افزودن تصویر'}
          </DialogTitle>
        </DialogHeader>
        <DialogBody>
          <FormProvider {...methods}>
            <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
              <Controller
                name="url"
                control={control}
                render={({ field }) => (
                  <ImageUploader
                    label="تصویر"
                    value={field.value}
                    onChange={(url) => {
                      field.onChange(url);
                      if (!url) setValue('alt', '');
                    }}
                  />
                )}
              />
              {errors.url && (
                <p className="text-sm text-red-500">{errors.url.message}</p>
              )}

              <div className="grid grid-cols-2 items-center gap-4">
                <Label htmlFor="alt">متن جایگزین</Label>
                <Controller
                  name="alt"
                  control={control}
                  render={({ field }) => (
                    <BaseInput
                      {...field}
                      disabled={!urlValue}
                      id="alt"
                      placeholder="متن جایگزین"
                    />
                  )}
                />
              </div>

              <div className="flex items-center gap-3">
                <Controller
                  name="is_primary"
                  control={control}
                  render={({ field }) => (
                    <>
                      <Switch
                        checked={field.value}
                        disabled={!urlValue}
                        id="is_primary"
                        onCheckedChange={field.onChange}
                      />
                      <Label htmlFor="is_primary">
                        تنظیم به عنوان تصویر اصلی
                      </Label>
                    </>
                  )}
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={handleClose}>
                  لغو
                </Button>
                <Button disabled={!urlValue} type="submit">
                  ذخیره
                </Button>
              </div>
            </form>
          </FormProvider>
        </DialogBody>
      </DialogContent>
    </Dialog>
  );
}
