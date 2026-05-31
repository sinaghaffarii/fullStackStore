'use client';

import { useRouter } from 'next/navigation';

import type { IDiscountType } from '@/types/discount';

import { useCreateDiscount } from '@/services/Discount';
import { DiscountTypeStatus } from '@/types/discount';
import { ROUTE_OBJECT } from '@/utils/constants';

import DiscountForm from '../+components/DiscountForm';

const initialDiscountValue: IDiscountType = {
  id: '',
  name: '',
  coupon_code: '',
  type: DiscountTypeStatus.PERCENTAGE,
  value: '',
  max_amount: '',
  starts_at: '',
  ends_at: '',
  is_active: false,
  badge_text: '',
};

const DiscountCreating = () => {
  const router = useRouter();

  const { mutate: createDiscountMutate, isPending: createDiscountPending } =
    useCreateDiscount();

  const submitHandler = (formValues: IDiscountType) => {
    createDiscountMutate(
      {
        ...formValues,
        starts_at: new Date(formValues.starts_at).toISOString(),
        ends_at: new Date(formValues.ends_at).toISOString(),
      },
      {
        onSuccess: (response) => {
          if (response.status) {
            router.push(ROUTE_OBJECT.D_DISCOUNTS);
          }
        },
      },
    );
  };

  return (
    <DiscountForm
      defaultValues={initialDiscountValue}
      submitText="ایجاد کد تخفیف"
      loading={createDiscountPending}
      onSubmit={submitHandler}
    />
  );
};

export default DiscountCreating;
