'use client';

import React, { useState } from 'react';
import Link from 'next/link';

type Subcategory = { title: string; href: string };
type Category = { title: string; subcategories: Subcategory[] };

const menuData: Category[] = [
  {
    title: 'مراقبت از مو',
    subcategories: [
      { title: 'شامپو', href: '/shop/hair/shampoo' },
      { title: 'نرم‌کننده', href: '/shop/hair/conditioner' },
      { title: 'ماسک مو', href: '/shop/hair/mask' },
      { title: 'روغن مو', href: '/shop/hair/oil' },
      { title: 'اسپری مو', href: '/shop/hair/spray' },
    ],
  },
  {
    title: 'رنگ مو و اکسیدان',
    subcategories: [
      { title: 'رنگ مو دائمی', href: '/shop/hair/hair-dye' },
      { title: 'رنگ مو موقت', href: '/shop/hair/temporary-dye' },
      { title: 'اکسیدان', href: '/shop/hair/oxidant' },
      { title: 'دکلره', href: '/shop/hair/bleach' },
    ],
  },
  {
    title: 'مراقبت از پوست',
    subcategories: [
      { title: 'مرطوب‌کننده', href: '/shop/skin/moisturizer' },
      { title: 'شوینده صورت', href: '/shop/skin/cleanser' },
      { title: 'ضد آفتاب', href: '/shop/skin/sunscreen' },
      { title: 'تونر', href: '/shop/skin/toner' },
      { title: 'سرم', href: '/shop/skin/serum' },
    ],
  },
  {
    title: 'آرایشی',
    subcategories: [
      { title: 'فونداسیون', href: '/shop/makeup/foundation' },
      { title: 'رژلب', href: '/shop/makeup/lipstick' },
      { title: 'ریمل', href: '/shop/makeup/mascara' },
      { title: 'سایه چشم', href: '/shop/makeup/eyeshadow' },
    ],
  },
];

const MegaMenu: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(0);

  return (
    <div
      className="max-w-[800px] bg-white rounded-b-lg border border-t-0 shadow-lg overflow-hidden"
      onMouseLeave={() => setActiveIndex(0)}
    >
      <div className="flex flex-row-reverse min-h-[300px]">
        {/* ستون چپ: زیر‌دسته‌ها */}
        <div className="w-2/3 p-2">
          {activeIndex !== null && (
            <div className="grid grid-cols-2 gap-4">
              {menuData[activeIndex]?.subcategories.map((sub) => (
                <Link
                  key={sub.title}
                  href={sub.href}
                  className="block text-xs font-medium text-gray-700 hover:text-pink-600 hover:bg-pink-50 rounded-md px-3 py-2 transition-colors duration-200"
                >
                  {sub.title}
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* ستون راست: دسته‌ها */}
        <div className="w-1/3 border-l border-gray-100 bg-gray-50">
          <ul className="py-2">
            {menuData.map((cat, index) => (
              <li
                key={cat.title}
                onMouseEnter={() => setActiveIndex(index)}
                className={`px-6 py-2 cursor-pointer text-xs font-medium transition-colors border-r-2
                  ${
                    activeIndex === index
                      ? 'bg-white text-pink-600 border-pink-600'
                      : 'text-gray-700 hover:bg-white border-transparent'
                  }`}
              >
                {cat.title}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default MegaMenu;
