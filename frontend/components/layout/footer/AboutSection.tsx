import { ArrowDown } from 'lucide-react';
import React, { useState } from 'react';

const AboutSection: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  return (
    <div className="space-y-4">
      <strong className="text-lg font-semibold text-gray-800">
        زیبا بمانید
      </strong>

      <div
        className={`overflow-hidden transition-all duration-300 ${isExpanded ? 'h-auto' : 'h-48'}`}
      >
        <p className="text-justify text-sm leading-7 text-gray-600">
          فاران شاپ یکی از معتبرترین فروشگاه‌های اینترنتی محصولات آرایشی،
          بهداشتی و عطر است که با هدف ارائه بهترین و باکیفیت‌ترین محصولات به
          مشتریان ایجاد شده است. فروشگاه فارانشاپ مجموعه‌ای گسترده از برندهای
          معروف را در دسترس زیبادوستان قرار می‌دهد. (متن توصیفی کوتاه شده برای
          خوانایی.)
        </p>
      </div>

      <button
        className="flex items-center gap-1 text-sm text-blue-600 transition-colors hover:text-blue-800"
        type="button"
        onClick={() => setIsExpanded((s) => !s)}
      >
        {isExpanded ? 'نمایش کمتر' : 'نمایش بیشتر'}
        <ArrowDown
          className={`size-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
        />
      </button>
    </div>
  );
};

export default AboutSection;
