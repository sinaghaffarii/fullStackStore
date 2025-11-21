import { Instagram, SendIcon } from 'lucide-react';
import React from 'react';

import Newsletter from './Newsletter';

const TopStrip: React.FC = () => (
  <section className="relative hidden w-full rounded-3xl bg-gray-900/95 px-8 py-6 text-white lg:block">
    <div className="grid grid-cols-3 gap-6">
      <div>
        <p className="text-primary-200 text-sm font-semibold">پشتیبانی:</p>
        <div className="mt-2 space-y-1 text-sm">
          <a className="hover:text-primary-200 block" href="tel:02186083140">
            021 8608 3140
          </a>
          <a className="hover:text-primary-200 block" href="tel:02188798540">
            021 8879 8540
          </a>
          <p className="text-xs text-gray-300">
            شنبه تا چهارشنبه ۹-۲۲ | پنج‌شنبه ۹-۱۹
          </p>
        </div>
      </div>

      <Newsletter />

      <div>
        <p className="text-primary-200 text-sm font-semibold">
          شبکه‌های اجتماعی
        </p>
        <div className="mt-3 flex gap-2">
          <button
            className="rounded-full border border-white/30 p-2 transition hover:border-white"
            type="button"
          >
            <Instagram className="size-4" />
          </button>
          <button
            className="rounded-full border border-white/30 p-2 transition hover:border-white"
            type="button"
          >
            <SendIcon className="size-4" />
          </button>
        </div>
      </div>
    </div>
  </section>
);

export default TopStrip;
