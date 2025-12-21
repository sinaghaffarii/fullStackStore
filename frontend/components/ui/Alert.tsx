import type { SweetAlertIcon } from 'sweetalert2';

import Swal from 'sweetalert2';

interface AlertOptions {
  title: string;
  text?: string;
  icon?: SweetAlertIcon;
  confirmButtonText?: string;
}

export function showAlert({
  title,
  text,
  icon = 'info',
  confirmButtonText = 'باشه',
}: AlertOptions) {
  return Swal.fire({
    title,
    text,
    icon,
    confirmButtonText,
  });
}

interface ConfirmOptions {
  title: string;
  text?: string;
  confirmButtonText?: string;
  cancelButtonText?: string;
}

export async function confirmAction({
  title,
  text,
  confirmButtonText = 'تأیید',
  cancelButtonText = 'انصراف',
}: ConfirmOptions): Promise<boolean> {
  const result = await Swal.fire({
    title,
    text,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText,
    cancelButtonText,
    reverseButtons: true,
  });

  return result.isConfirmed;
}
