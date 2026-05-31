'use client';

import { useParams, useRouter } from 'next/navigation';

import type { IDiscountType } from '@/types/discount';

import FetchLoading from '@/components/ui/FetchLoading';
import { useEditDiscount, useGetDiscountById } from '@/services/Discount';
import { ROUTE_OBJECT } from '@/utils/constants';

import DiscountForm from '../../+components/DiscountForm';

type EditDiscountFormData = Omit<IDiscountType, 'id'>;

const DiscountEditing = () => {
  const { id } = useParams();
  const router = useRouter();
  const { data: discountData, isLoading: DiscountLoading } = useGetDiscountById(
    id as string,
  );

  const { mutate: updateDiscountMutate, isPending: updateDiscountPending } =
    useEditDiscount();

  const editDiscountHandler = (formValues: EditDiscountFormData) => {
    updateDiscountMutate(
      {
        id: id as string,
        ...formValues,
        starts_at: new Date(formValues.starts_at).toISOString(),
        ends_at: new Date(formValues.ends_at).toISOString(),
      },
      {
        onSuccess: (res) => {
          if (res.status) router.push(ROUTE_OBJECT.D_DISCOUNTS);
        },
      },
    );
  };

  if (DiscountLoading) return <FetchLoading />;

  return (
    <DiscountForm
      defaultValues={discountData?.data as IDiscountType}
      submitText="بروزرسانی کد تخفیف"
      loading={updateDiscountPending}
      onSubmit={editDiscountHandler}
    />
  );
};

export default DiscountEditing;
