/* eslint-disable max-lines */
'use client';
import Link from 'next/link';
import React, { useState } from 'react';

export interface MenuItem {
  title: string;
  href?: string;
  children?: MenuItem[];
}

export interface Category {
  title: string;
  children: MenuItem[];
}

export const menuData: Category[] = [
  {
    title: 'مراقبت از مو',
    children: [
      {
        title: 'شامپو',
        href: '/products/hair/shampoo',
        children: [
          {
            title: 'شامپو خشک',
            href: '/products/hair/shampoo/dry',
            children: [
              {
                title: 'شامپو گیاهی خشک',
                href: '/products/hair/shampoo/dry/herbal',
              },
              {
                title: 'شامپو شیمیایی خشک',
                href: '/products/hair/shampoo/dry/chemical',
              },
            ],
          },
          {
            title: 'شامپو چرب',
            href: '/products/hair/shampoo/oily',
            children: [
              {
                title: 'شامپو ضد چربی',
                href: '/products/hair/shampoo/oily/anti-grease',
              },
              {
                title: 'شامپو تنظیم کننده',
                href: '/products/hair/shampoo/oily/regulator',
              },
            ],
          },
        ],
      },
      {
        title: 'نرم‌کننده',
        href: '/products/hair/conditioner',
        children: [
          {
            title: 'نرم‌کننده روزانه',
            href: '/products/hair/conditioner/daily',
          },
          { title: 'نرم‌کننده عمیق', href: '/products/hair/conditioner/deep' },
        ],
      },
      { title: 'ماسک مو', href: '/products/hair/mask' },
      { title: 'روغن مو', href: '/products/hair/oil' },
      { title: 'اسپری مو', href: '/products/hair/spray' },
    ],
  },
  {
    title: 'رنگ مو و اکسیدان',
    children: [
      { title: 'رنگ مو دائمی', href: '/products/hair/hair-dye' },
      { title: 'رنگ مو موقت', href: '/products/hair/temporary-dye' },
      { title: 'اکسیدان', href: '/products/hair/oxidant' },
      { title: 'دکلره', href: '/products/hair/bleach' },
    ],
  },
  {
    title: 'مراقبت از پوست',
    children: [
      { title: 'مرطوب‌کننده', href: '/products/skin/moisturizer' },
      { title: 'شوینده صورت', href: '/products/skin/cleanser' },
      { title: 'ضد آفتاب', href: '/products/skin/sunscreen' },
      { title: 'تونر', href: '/products/skin/toner' },
      { title: 'سرم', href: '/products/skin/serum' },
    ],
  },
  {
    title: 'آرایشی',
    children: [
      { title: 'فونداسیون', href: '/products/makeup/foundation' },
      { title: 'رژلب', href: '/products/makeup/lipstick' },
      { title: 'ریمل', href: '/products/makeup/mascara' },
      { title: 'سایه چشم', href: '/products/makeup/eyeshadow' },
    ],
  },
];

const renderSubcategories = (items: MenuItem[], level = 0) => {
  return items.map((item) => (
    <div
      className={`${level > 0 ? 'mr-2 border-r-2 border-pink-100' : ''}`}
      key={item.title}
    >
      <Link
        href={item.href || '#'}
        className={`block rounded-md px-3 py-2 font-medium transition-colors duration-200 ${
          level === 0
            ? 'text-sm text-gray-700 hover:bg-pink-50 hover:text-pink-600'
            : 'text-xs text-gray-600 hover:text-pink-500'
        }`}
      >
        {''.repeat(level)} {item.title}
      </Link>
      {item.children && renderSubcategories(item.children, level + 1)}
    </div>
  ));
};

const MegaMenu: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(0);

  return (
    <div
      className="max-w-[800px] overflow-hidden rounded-b-lg border border-t-0 bg-white shadow-lg"
      onMouseLeave={() => setActiveIndex(0)}
    >
      <div className="flex min-h-[300px] flex-row-reverse">
        {/* ستون چپ: زیر‌دسته‌ها */}
        <div className="w-2/3 p-4">
          {activeIndex !== null && (
            <div className="grid grid-cols-2 gap-3">
              {renderSubcategories(menuData[activeIndex]?.children || [])}
            </div>
          )}
        </div>

        {/* ستون راست: دسته‌ها */}
        <div className="w-1/3 border-l border-gray-100 bg-gray-50">
          <ul className="py-2">
            {menuData.map((cat, index) => (
              // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
              <li
                key={cat.title}
                onMouseEnter={() => setActiveIndex(index)}
                className={`cursor-pointer border-r-2 px-6 py-3 text-sm font-medium transition-colors
                  ${
                    activeIndex === index
                      ? 'border-pink-600 bg-white text-pink-600 shadow-sm'
                      : 'border-transparent text-gray-700 hover:bg-white hover:text-pink-500'
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
