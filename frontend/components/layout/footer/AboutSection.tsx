import { ArrowDown } from 'lucide-react';
import React, { useState } from 'react';

const AboutSection: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <section className="space-y-4">
      <h3 className="text-base font-semibold text-gray-900">زیبا بمانید</h3>

      <div
        aria-expanded={isExpanded}
        className={`relative overflow-hidden text-sm leading-7 text-gray-600 transition-all duration-300 ${
          isExpanded ? 'max-h-[420px]' : 'max-h-32'
        }`}
      >
        <p>
          فاران آرایشی شاپ یکی از معتبرترین فروشگاه‌های اینترنتی محصولات آرایشی،
          بهداشتی و عطر است که با هدف ارائه‌ی محصولات اصیل و متنوع از برندهای
          جهانی شکل گرفته است. ما تلاش می‌کنیم تجربه‌ای شفاف، سریع و لذت‌بخش
          برای خرید آنلاین شما فراهم کنیم.
        </p>

        {!isExpanded && (
          <span className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-linear-to-t from-white to-transparent" />
        )}
      </div>

      <button
        className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 transition-colors hover:text-blue-800"
        type="button"
        onClick={() => setIsExpanded((prev) => !prev)}
      >
        {isExpanded ? 'نمایش کمتر' : 'نمایش بیشتر'}
        <ArrowDown
          className={`size-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
        />
      </button>
    </section>
  );
};

export default AboutSection;
