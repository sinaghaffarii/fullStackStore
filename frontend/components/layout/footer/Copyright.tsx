import { Copyright as CopyrightIcon } from 'lucide-react';
import React from 'react';

const FooterLegal: React.FC = () => (
  <div className="mt-8 border-t border-gray-200 pt-6 text-center text-xs text-gray-500">
    <div className="flex flex-wrap items-center justify-center gap-2 text-gray-600">
      <CopyrightIcon className="size-4" />
      <span>کلیه حقوق برای شرکت آریاس فاران آرایشی محفوظ است.</span>
      <a
        className="underline-offset-4 hover:underline"
        href="https://rojashop.com/posts/قوانین-و-مقررات"
      >
        قوانین و مقررات
      </a>
      <span aria-hidden>•</span>
      <a
        className="underline-offset-4 hover:underline"
        href="https://rojashop.com/posts/حریم-خصوصی"
      >
        حریم خصوصی
      </a>
    </div>
    <p className="mt-2">
      استفاده از مطالب فقط برای مقاصد غیرتجاری و با ذکر منبع مجاز است.
    </p>
  </div>
);

export default FooterLegal;
