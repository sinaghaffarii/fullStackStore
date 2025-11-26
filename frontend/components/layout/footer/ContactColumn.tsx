import { HomeIcon, MailIcon, PhoneCall } from 'lucide-react';
import React from 'react';

const ContactColumn: React.FC = () => (
  <section aria-labelledby="footer-contact" className="space-y-4">
    <div className="flex items-center justify-between gap-4">
      <h2 className="text-2xl font-semibold text-primary" id="footer-contact">
        FaranGallery
      </h2>
      <a
        className="rounded-sm bg-black px-3 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-gray-900 lg:hidden"
        href="tel:+982157826000"
      >
        تماس با پرشین ویپ
      </a>
    </div>

    <p className="text-sm text-gray-600">
      شنبه تا چهارشنبه ۹ تا ۲۲ — پنج‌شنبه ۹ تا ۱۹
    </p>

    <address className="space-y-4 text-sm text-gray-700 not-italic">
      <div className="flex gap-3">
        <HomeIcon className="mt-1 size-4 shrink-0 text-black" />
        <div>
          <strong>بخش اداری:</strong> تهران، بلوار میرداماد، جنب دفینه، ساختمان
          اداری، ط ۴، واحد ۴۱۲
        </div>
      </div>

      <div className="flex gap-3">
        <HomeIcon className="mt-1 size-4 shrink-0 text-black" />
        <div>
          <strong>آدرس فروشگاه:</strong>{' '}
          <a
            className="text-black underline-offset-4 hover:underline"
            href="https://rojashop.com/branches"
          >
            فروشگاه‌های پرشین ویپ
          </a>
        </div>
      </div>

      <div className="flex gap-3">
        <PhoneCall className="mt-1 size-4 shrink-0 text-black" />
        <div className="space-y-1">
          <a
            dir="ltr"
            className="block font-semibold text-gray-900"
            href="tel:+982186083140"
          >
            021-8608-3140
          </a>
          <a
            dir="ltr"
            className="block font-semibold text-gray-900"
            href="tel:+982188798540"
          >
            021-8879-8540
          </a>
        </div>
      </div>

      <div className="flex gap-3">
        <MailIcon className="mt-1 size-4 shrink-0 text-black" />
        <div>
          <strong>ایمیل:</strong>{' '}
          <a
            className="text-black underline-offset-4 hover:underline"
            href="mailto:online@rojagroup.com"
          >
            online@rojagroup.com
          </a>
        </div>
      </div>
    </address>
  </section>
);

export default ContactColumn;
