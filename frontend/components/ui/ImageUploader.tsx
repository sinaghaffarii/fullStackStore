/* eslint-disable max-lines-per-function */
'use client';

import type { Crop } from 'react-image-crop';

import { Trash2, Upload, X } from 'lucide-react';
import React, { useRef, useState } from 'react';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { toast } from 'react-toastify';

import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { useUploadImage } from '@/services/Upload';

/* -------------------------------------------------------------------------- */
/*                                   Types                                    */
/* -------------------------------------------------------------------------- */

interface ImageUploaderProps {
  value?: string;
  onChange: (url: string) => void;
  label?: string;
}

/* -------------------------------------------------------------------------- */
/*                                Configuration                               */
/* -------------------------------------------------------------------------- */

const MAX_FILE_SIZE_MB = 5;

const CROP_PRESETS: {
  label: string;
  aspect?: number;
}[] = [
  { label: 'مربع 1:1', aspect: 1 },
  { label: 'افقی 16:9', aspect: 16 / 9 },
  { label: 'عمودی 9:16', aspect: 9 / 16 },
  { label: 'افقی 4:3', aspect: 4 / 3 },
  { label: 'آزاد', aspect: undefined },
];

/* -------------------------------------------------------------------------- */
/*                               ImageUploader                                */
/* -------------------------------------------------------------------------- */

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  value,
  onChange,
  label = 'آپلود تصویر',
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  const [src, setSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState<Crop>();
  const [aspect, setAspect] = useState<number | undefined>(1);

  const uploadMutation = useUploadImage();

  /* ------------------------------------------------------------------------ */
  /*                              File Handling                               */
  /* ------------------------------------------------------------------------ */

  const onFileSelect = (file: File) => {
    const maxSizeBytes = MAX_FILE_SIZE_MB * 1024 * 1024;

    if (file.size > maxSizeBytes) {
      toast.info(`حجم تصویر نباید بیشتر از ${MAX_FILE_SIZE_MB} مگابایت باشد.`);
      return;
    }

    const reader = new FileReader();
    reader.onload = () => setSrc(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) onFileSelect(file);
  };

  const createCenteredCrop = (aspectFn?: number): Crop | undefined => {
    if (!imageRef.current || !aspectFn) return undefined;

    const { width, height } = imageRef.current;

    let cropWidth = width * 0.8;
    let cropHeight = cropWidth / aspectFn;

    if (cropHeight > height * 0.8) {
      cropHeight = height * 0.8;
      cropWidth = cropHeight * aspectFn;
    }

    return {
      unit: 'px',
      width: cropWidth,
      height: cropHeight,
      x: (width - cropWidth) / 2,
      y: (height - cropHeight) / 2,
    };
  };

  /* ------------------------------------------------------------------------ */
  /*                             Upload Cropped Image                          */
  /* ------------------------------------------------------------------------ */

  const uploadCroppedImage = () => {
    const image = imageRef.current;
    if (!image || !crop || !crop.width || !crop.height) return;

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    const canvas = document.createElement('canvas');
    canvas.width = Math.floor(crop.width);
    canvas.height = Math.floor(crop.height);

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      canvas.width,
      canvas.height,
    );

    canvas.toBlob(
      (blob) => {
        if (!blob) {
          toast.error('خطا در پردازش تصویر');
          return;
        }

        uploadMutation.mutate(
          new File([blob], 'image.jpg', { type: blob.type }),
          {
            onSuccess: (res) => {
              onChange(res.data.url);
              setSrc(null);
              setCrop(undefined);
            },
          },
        );
      },
      'image/jpeg',
      0.9,
    );
  };

  /* ------------------------------------------------------------------------ */
  /*                                   Render                                  */
  /* ------------------------------------------------------------------------ */

  return (
    <div className="space-y-3">
      {label && (
        <label className="mb-3 text-sm font-medium text-foreground">
          {label}
        </label>
      )}

      {/* ------------------------------------------------------------------ */}
      {/*                             Dropzone                               */}
      {/* ------------------------------------------------------------------ */}

      {!value && !src && (
        <div
          aria-label={label}
          className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-muted-foreground/25 bg-muted/30 px-6 py-10 text-center transition hover:border-primary/50 hover:bg-muted focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
          tabIndex={0}
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              inputRef.current?.click();
            }
          }}
          role="button"
        >
          <Upload className="mb-3 size-8 text-muted-foreground" />

          <p className="text-sm font-medium">
            تصویر را اینجا رها کنید یا کلیک کنید
          </p>

          <p className="mt-1 text-xs text-muted-foreground">
            JPG, PNG, WEBP — حداکثر {MAX_FILE_SIZE_MB}MB
          </p>
        </div>
      )}

      <input
        hidden
        accept="image/*"
        ref={inputRef}
        type="file"
        onChange={(e) => {
          e.preventDefault();
          e.stopPropagation();
          if (e.target.files) {
            onFileSelect(e.target.files[0]);
          }
        }}
        onClick={(e) => e.stopPropagation()}
      />

      {/* ------------------------------------------------------------------ */}
      {/*                             Crop View                               */}
      {/* ------------------------------------------------------------------ */}

      {src && (
        <div className="space-y-4 rounded-lg border bg-muted/30 p-4">
          {/* Crop Presets */}
          <div className="flex flex-wrap gap-2">
            {CROP_PRESETS.map((preset) => (
              <button
                key={preset.label}
                type="button"
                onClick={() => {
                  setAspect(preset.aspect);
                  setCrop(createCenteredCrop(preset.aspect));
                }}
                className={cn(
                  'rounded-md border px-3 py-1.5 text-xs font-medium transition-colors',
                  aspect === preset.aspect
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-input hover:bg-accent',
                )}
              >
                {preset.label}
              </button>
            ))}
          </div>

          {/* Crop Area */}
          <ReactCrop
            aspect={aspect}
            className="max-h-96"
            crop={crop}
            onChange={setCrop}
          >
            <img
              alt="crop"
              className="max-w-full"
              ref={imageRef}
              src={src}
              onLoad={() => {
                setCrop(createCenteredCrop(aspect));
              }}
            />
          </ReactCrop>
          {/* Actions */}
          <div className="flex gap-2">
            <Button
              className="flex-1"
              disabled={!crop?.width || !crop?.height}
              type="button"
              loading={uploadMutation.isPending}
              onClick={(e) => {
                e.preventDefault();
                uploadCroppedImage();
              }}
            >
              تایید و آپلود
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setSrc(null);
                setCrop(undefined);
              }}
            >
              <X className="size-4" />
            </Button>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/*                           Uploaded Preview                          */}
      {/* ------------------------------------------------------------------ */}

      {value && (
        <div className="group relative size-44 overflow-hidden rounded-lg border-2 border-dashed border-primary/20 bg-muted/30 transition-all hover:border-primary/40 p-2">
          <img
            alt="preview"
            className="size-full object-cover transition-transform group-hover:scale-105"
            src={`${process.env.NEXT_PUBLIC_API_URL_IMAGE}${value}`}
          />

          <div className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 transition-opacity group-hover:opacity-100">
            <button
              className="rounded-full bg-destructive p-2 text-white shadow-lg transition-transform hover:scale-110"
              type="button"
              onClick={() => onChange('')}
            >
              <Trash2 className="size-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
