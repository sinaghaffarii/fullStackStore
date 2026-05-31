/* eslint-disable max-lines */
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { AlertCircle, Lock, Mail, User } from 'lucide-react';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';

import type { IAdmin } from '@/types/admin';
import type { CreateAdminFormData } from '@/validations';

import { Button } from '@/components/ui/Button';
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/Dialog';
import { BaseInput } from '@/components/ui/Input';
import { useCreateAdmin, useUpdateAdmin } from '@/services/Admins';
import { createAdminSchema } from '@/validations';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  admin?: IAdmin;
}

const FormField = ({
  name,
  label,
  type,
  icon: Icon,
  placeholder,
  control,
  error,
}: any) => (
  <Controller
    name={name}
    control={control}
    render={({ field: { ref, ...fieldWithoutRef } }) => (
      <div className="relative">
        <Icon className="absolute top-10 right-3 size-4 text-muted-foreground" />
        <BaseInput
          dir={type === 'email' || type === 'password' ? 'ltr' : 'rtl'}
          required
          className="pr-10"
          label={label}
          type={type}
          placeholder={placeholder}
          {...fieldWithoutRef}
          error={error}
        />
      </div>
    )}
  />
);

export function AdminModal({ isOpen, onClose, admin }: Props) {
  const isEdit = !!admin;
  const { mutate: create, isPending: creating } = useCreateAdmin();
  const { mutate: update, isPending: updating } = useUpdateAdmin();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<CreateAdminFormData>({
    resolver: zodResolver(createAdminSchema),
    defaultValues: { username: '', email: '', password: '' },
  });

  useEffect(() => {
    reset(
      isEdit && admin
        ? { username: admin.username || '', email: admin.email, password: '' }
        : { username: '', email: '', password: '' },
    );
  }, [admin, isEdit, reset]);

  const onSubmit = (data: CreateAdminFormData) => {
    const callbacks = {
      onSuccess: () => {
        onClose();
        reset();
      },
    };
    if (isEdit && admin) {
      update({ id: admin.id, email: data.email }, callbacks);
    } else {
      create(data, callbacks);
    }
  };

  const isPending = creating || updating || isSubmitting;

  return (
    <Dialog onOpenChange={onClose} open={isOpen}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? 'ویرایش ادمین' : 'افزودن ادمین جدید'}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? 'ویرایش اطلاعات ادمین. نام کاربری قابل تغییر نیست.'
              : 'اطلاعات ادمین جدید را وارد کنید.'}
          </DialogDescription>
        </DialogHeader>

        <DialogBody>
          <form
            className="space-y-5"
            id="admin-form"
            onSubmit={handleSubmit(onSubmit)}
          >
            {isEdit ? (
              <div className="flex items-start gap-3 rounded-lg bg-muted/50 p-4">
                <AlertCircle className="size-5 shrink-0 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">
                    نام کاربری: {admin?.username}
                  </p>
                  <p className="text-xs text-muted-foreground">غیرقابل تغییر</p>
                </div>
              </div>
            ) : (
              <FormField
                label="نام کاربری"
                name="username"
                type="text"
                control={control}
                error={errors.username?.message}
                icon={User}
                placeholder="username"
              />
            )}

            <FormField
              label="ایمیل"
              name="email"
              type="email"
              control={control}
              error={errors.email?.message}
              icon={Mail}
              placeholder="admin@example.com"
            />

            {!isEdit && (
              <FormField
                label="رمز عبور"
                name="password"
                type="password"
                control={control}
                error={errors.password?.message}
                icon={Lock}
                placeholder="حداقل 8 کاراکتر"
              />
            )}
          </form>
        </DialogBody>

        <DialogFooter>
          <Button
            disabled={isPending}
            type="button"
            variant="outline"
            onClick={onClose}
          >
            انصراف
          </Button>
          <Button
            disabled={isPending}
            type="submit"
            form="admin-form"
            loading={isPending}
          >
            {isEdit ? 'ذخیره تغییرات' : 'ایجاد ادمین'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
