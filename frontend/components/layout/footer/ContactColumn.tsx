import { HomeIcon, MailIcon } from 'lucide-react';
import React from 'react';

const ContactColumn: React.FC = () => (
  <div className="col-span-1 flex flex-col">
    <div className="flex items-center justify-between">
      <h1 className="text-2xl font-semibold whitespace-nowrap text-primary">
        FaranGallery
      </h1>
      <a
        className="rounded-sm bg-black px-3 py-2 text-sm text-white lg:hidden"
        href="tel:+982157826000"
      >
        تماس با فاران
      </a>
    </div>

    <strong className="my-3 font-semibold text-gray-800">اطلاعات تماس</strong>

    <div className="space-y-3 text-sm text-gray-600">
      <div className="flex items-start gap-2">
        <HomeIcon className="mt-0.5 size-4 shrink-0 text-black" />
        <div>
          <strong>بخش اداری:</strong> تهران، بلوار میرداماد، جنب دفینه، بازار
          بزرگ میرداماد، ساختمان اداری، ط ۴، واحد ۴۱۲
        </div>
      </div>

      <div className="flex items-start gap-2">
        <HomeIcon className="mt-0.5 size-4 shrink-0 text-black" />
        <div>
          <strong>آدرس فروشگاه:</strong>{' '}
          <a
            className="text-black hover:underline"
            href="https://rojashop.com/branches"
          >
            فروشگاه های فاران
          </a>
        </div>
      </div>

      <div className="flex items-start gap-2">
        <MailIcon className="mt-0.5 size-4 shrink-0 text-black" />
        <div>
          <strong>پست الکترونیکی:</strong> online@rojagroup.com
        </div>
      </div>
    </div>
  </div>
);

export default ContactColumn;
