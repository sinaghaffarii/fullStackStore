'use client';

import type * as LabelPrimitive from '@radix-ui/react-label';
import type { ControllerProps, FieldPath, FieldValues } from 'react-hook-form';

import { Slot } from '@radix-ui/react-slot';
import * as React from 'react';
import {
  Controller,
  FormProvider,
  useFormContext,
  useFormState,
} from 'react-hook-form';

import { Label } from '@/components/ui/Label';

import { cn } from '../../lib/utils';

const Form = FormProvider;

interface FormItemContextValue {
  id: string;
}

const FormItemContext = React.createContext<FormItemContextValue>(
  {} as FormItemContextValue,
);
FormItemContext.displayName = 'FormItemContext';

interface FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> {
  name: TName;
}

const FormFieldContext = React.createContext<FormFieldContextValue>(
  {} as FormFieldContextValue,
);
FormFieldContext.displayName = 'FormFieldContext';

const useFormField = () => {
  const fieldContext = React.use(FormFieldContext);
  const itemContext = React.use(FormItemContext);

  const { getFieldState } = useFormContext();
  const formState = useFormState({ name: fieldContext.name });
  const fieldState = getFieldState(fieldContext.name, formState);

  if (!fieldContext) {
    throw new Error('useFormField should be used within <FormField>');
  }

  return {
    id: itemContext.id,
    name: fieldContext.name,
    formItemId: `${itemContext.id}-form-item`,
    formDescriptionId: `${itemContext.id}-form-item-description`,
    formMessageId: `${itemContext.id}-form-item-message`,
    ...fieldState,
  };
};

const FormField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  ...props
}: ControllerProps<TFieldValues, TName>) => {
  const contextValue = React.useMemo(
    () => ({ name: props.name }),
    [props.name],
  );

  return (
    <FormFieldContext value={contextValue}>
      <Controller {...props} />
    </FormFieldContext>
  );
};

function FormItem({ className, ...props }: React.ComponentProps<'div'>) {
  const id = React.useId();

  const contextValue = React.useMemo(() => ({ id }), [id]);

  return (
    <FormItemContext value={contextValue}>
      <div
        className={cn('grid gap-2', className)}
        data-slot="form-item"
        {...props}
      />
    </FormItemContext>
  );
}

function FormLabel({
  className,
  ...props
}: React.ComponentProps<typeof LabelPrimitive.Root>) {
  const { error, formItemId } = useFormField();

  return (
    <Label
      className={cn('data-[errors=true]:text-destructive', className)}
      data-error={!!error}
      data-slot="form-label"
      htmlFor={formItemId}
      {...props}
    />
  );
}

function FormControl(props: React.ComponentProps<typeof Slot>) {
  const { error, formItemId, formDescriptionId, formMessageId } =
    useFormField();

  return (
    <Slot
      aria-invalid={!!error}
      id={formItemId}
      data-slot="form-control"
      aria-describedby={
        !error
          ? `${formDescriptionId}`
          : `${formDescriptionId} ${formMessageId}`
      }
      {...props}
    />
  );
}

function FormDescription({ className, ...props }: React.ComponentProps<'p'>) {
  const { formDescriptionId } = useFormField();

  return (
    <p
      className={cn('text-sm text-muted-foreground', className)}
      id={formDescriptionId}
      data-slot="form-description"
      {...props}
    />
  );
}

function FormMessage({ className, ...props }: React.ComponentProps<'p'>) {
  const { error, formMessageId } = useFormField();
  const body = error ? String(error.message ?? '') : props.children;

  if (!body) return null;

  return (
    <p
      className={cn('text-sm text-destructive', className)}
      id={formMessageId}
      data-slot="form-message"
      {...props}
    >
      {body}
    </p>
  );
}

export {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  useFormField,
};
