/* eslint-disable max-lines-per-function */
/* eslint-disable max-lines */

import { Info } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Controller, useForm } from 'react-hook-form';
import DatePicker from 'react-multi-date-picker';
import TimePicker from 'react-multi-date-picker/plugins/time_picker';

import type { IDiscountType } from '@/types/discount';

import { Button } from '@/components/ui/Button';
import { BaseInput } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/Select';
import { Switch } from '@/components/ui/Switch';
import { DiscountTypeStatus } from '@/types/discount';
import { ROUTE_OBJECT } from '@/utils/constants';

interface Props {
  defaultValues: IDiscountType;
  onSubmit: (formValues: IDiscountType) => void;
  loading: boolean;
  submitText: string;
}

const DiscountForm = ({
  defaultValues,
  loading,
  onSubmit,
  submitText,
}: Props) => {
  const router = useRouter();
  const {
    control,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<IDiscountType>({ defaultValues });

  // eslint-disable-next-line react-hooks/incompatible-library
  const discountType = watch('type') === DiscountTypeStatus.PERCENTAGE;

  const handleFormSubmit = handleSubmit((formValues) => {
    if (formValues.type === DiscountTypeStatus.FIXED) {
      delete formValues.max_amount;
      onSubmit(formValues);
    } else {
      onSubmit(formValues);
    }
  });

  return (
    <div className="flex h-full flex-col">
      <div className="grid flex-1 grid-cols-1 gap-5 overflow-auto p-5 sm:grid-cols-2 md:gap-10 lg:grid-cols-3">
        <Controller
          name="name"
          rules={{ required: 'نام تخفیف الزامی است' }}
          control={control}
          render={({ field: { ref, ...fieldWithoutRef } }) => (
            <BaseInput
              label="نام تخفیف"
              placeholder="20 درصد تخفیف محصولات بهداشتی شون"
              {...fieldWithoutRef}
              error={errors.name?.message}
            />
          )}
        />
        <Controller
          name="badge_text"
          rules={{ required: 'نام نمایشی الزامی است' }}
          control={control}
          render={({ field: { ref, ...fieldWithoutRef } }) => (
            <BaseInput
              label="نام نمایشی"
              placeholder="50% تخفیف Black Friday"
              {...fieldWithoutRef}
              error={errors.badge_text?.message}
            />
          )}
        />
        <Controller
          name="coupon_code"
          rules={{ required: 'کد تخفیف الزامی است' }}
          control={control}
          render={({ field: { ref, ...fieldWithoutRef } }) => (
            <BaseInput
              label="کد تخفیف"
              placeholder="NOROOZ1405"
              {...fieldWithoutRef}
              error={errors.coupon_code?.message}
            />
          )}
        />
        <Controller
          name="type"
          rules={{ required: 'نوع تخفیف الزامی است' }}
          control={control}
          render={({ field }) => (
            <Select
              defaultValue={field.value}
              label="نوع تخفیف"
              value={field.value}
              error={errors.type?.message}
              onValueChange={field.onChange}
            >
              <SelectTrigger size="lg">
                <SelectValue placeholder="نوع تخفیف" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={DiscountTypeStatus.PERCENTAGE}>
                  درصدی
                </SelectItem>
                <SelectItem value={DiscountTypeStatus.FIXED}>ثابت</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
        <Controller
          name="value"
          rules={{ required: 'مقدار تخفیف الزامی است' }}
          control={control}
          render={({ field: { ref, ...fieldWithoutRef } }) => {
            return (
              <div>
                <BaseInput
                  label="مقدار تخفیف"
                  type="number"
                  placeholder="10% یا 10،000 تومان"
                  {...fieldWithoutRef}
                  error={errors.value?.message}
                />
                <p className="mt-1 flex items-center justify-start gap-2 text-xs text-gray-500 md:text-sm">
                  <Info size="18" />
                  {`مقدار تخفیف در نظر گرفته بر حسب ${discountType ? 'درصد' : 'تومان'} محاسبه میشود`}
                </p>
              </div>
            );
          }}
        />
        {watch('type') === DiscountTypeStatus.PERCENTAGE && (
          <Controller
            name="max_amount"
            rules={{ required: 'کامل کردن این فیلد الزامیست' }}
            control={control}
            render={({ field: { ref, ...fieldWithoutRef } }) => (
              <BaseInput
                label="حداکثر میزان تخفیف"
                type="number"
                placeholder="200،000 تومان"
                {...fieldWithoutRef}
                error={errors.max_amount?.message}
              />
            )}
          />
        )}

        <Controller
          name="starts_at"
          control={control}
          render={({ field }) => {
            return (
              <div className="flex flex-col items-start justify-start gap-1">
                <p className="block text-sm font-medium text-foreground">
                  تاریخ شروع
                </p>
                <DatePicker
                  disableDayPicker
                  value={field.value}
                  format="HH:mm"
                  onChange={field.onChange}
                  plugins={[
                    <TimePicker key="time-picker-plugin" hideSeconds />,
                  ]}
                  style={{
                    height: '40px',
                    borderRadius: '10px',
                    borderColor: 'rgba(0.1,0.1,0.1,0.1)',
                  }}
                />
              </div>
            );
          }}
        />
        <Controller
          name="ends_at"
          control={control}
          render={({ field }) => {
            return (
              <div className="flex flex-col items-start justify-start gap-1">
                <p className="block text-sm font-medium text-foreground">
                  تاریخ پایان
                </p>
                <DatePicker
                  disableDayPicker
                  value={field.value}
                  format="HH:mm"
                  onChange={field.onChange}
                  plugins={[
                    <TimePicker key="time-picker-plugin" hideSeconds />,
                  ]}
                  style={{
                    height: '40px',
                    borderRadius: '10px',
                    borderColor: 'rgba(0.1,0.1,0.1,0.1)',
                  }}
                />
              </div>
            );
          }}
        />

        <Controller
          name="is_active"
          control={control}
          render={({ field: { value, onChange } }) => (
            <div className="flex h-fit items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <Label className="text-base font-medium" htmlFor="is_active">
                  وضعیت تخفیف
                </Label>
                <p className="text-sm text-muted-foreground">
                  تخفیف فعال در سایت قابل استفاده میباشد
                </p>
              </div>
              <Switch
                checked={value}
                id="is_active"
                onCheckedChange={onChange}
              />
            </div>
          )}
        />
      </div>
      <footer className="sticky bottom-0 flex w-full items-center justify-end gap-5 rounded-lg border p-3">
        <Button
          variant="outline"
          onClick={() => router.push(ROUTE_OBJECT.D_DISCOUNTS)}
        >
          بازگشت
        </Button>
        <Button disabled={loading} loading={loading} onClick={handleFormSubmit}>
          {submitText}
        </Button>
      </footer>
    </div>
  );
};

export default DiscountForm;
