'use client';
import React, { useState } from 'react';
import Link from 'next/link';

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
        href: '/shop/hair/shampoo',
        children: [
          {
            title: 'شامپو خشک',
            href: '/shop/hair/shampoo/dry',
            children: [
              {
                title: 'شامپو گیاهی خشک',
                href: '/shop/hair/shampoo/dry/herbal',
              },
              {
                title: 'شامپو شیمیایی خشک',
                href: '/shop/hair/shampoo/dry/chemical',
              },
            ],
          },
          {
            title: 'شامپو چرب',
            href: '/shop/hair/shampoo/oily',
            children: [
              {
                title: 'شامپو ضد چربی',
                href: '/shop/hair/shampoo/oily/anti-grease',
              },
              {
                title: 'شامپو تنظیم کننده',
                href: '/shop/hair/shampoo/oily/regulator',
              },
            ],
          },
        ],
      },
      {
        title: 'نرم‌کننده',
        href: '/shop/hair/conditioner',
        children: [
          { title: 'نرم‌کننده روزانه', href: '/shop/hair/conditioner/daily' },
          { title: 'نرم‌کننده عمیق', href: '/shop/hair/conditioner/deep' },
        ],
      },
      { title: 'ماسک مو', href: '/shop/hair/mask' },
      { title: 'روغن مو', href: '/shop/hair/oil' },
      { title: 'اسپری مو', href: '/shop/hair/spray' },
    ],
  },
  {
    title: 'رنگ مو و اکسیدان',
    children: [
      { title: 'رنگ مو دائمی', href: '/shop/hair/hair-dye' },
      { title: 'رنگ مو موقت', href: '/shop/hair/temporary-dye' },
      { title: 'اکسیدان', href: '/shop/hair/oxidant' },
      { title: 'دکلره', href: '/shop/hair/bleach' },
    ],
  },
  {
    title: 'مراقبت از پوست',
    children: [
      { title: 'مرطوب‌کننده', href: '/shop/skin/moisturizer' },
      { title: 'شوینده صورت', href: '/shop/skin/cleanser' },
      { title: 'ضد آفتاب', href: '/shop/skin/sunscreen' },
      { title: 'تونر', href: '/shop/skin/toner' },
      { title: 'سرم', href: '/shop/skin/serum' },
    ],
  },
  {
    title: 'آرایشی',
    children: [
      { title: 'فونداسیون', href: '/shop/makeup/foundation' },
      { title: 'رژلب', href: '/shop/makeup/lipstick' },
      { title: 'ریمل', href: '/shop/makeup/mascara' },
      { title: 'سایه چشم', href: '/shop/makeup/eyeshadow' },
    ],
  },
];

const renderSubcategories = (items: MenuItem[], level = 0) => {
  return items.map((item) => (
    <div
      key={item.title}
      className={`${level > 0 ? 'border-r-2 border-pink-100 mr-2' : ''}`}
    >
      <Link
        href={item.href || '#'}
        className={`block font-medium rounded-md px-3 py-2 transition-colors duration-200 ${
          level === 0
            ? 'text-gray-700 hover:text-pink-600 hover:bg-pink-50 text-sm'
            : 'text-gray-600 hover:text-pink-500 text-xs'
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
      className="max-w-[800px] bg-white rounded-b-lg border border-t-0 shadow-lg overflow-hidden"
      onMouseLeave={() => setActiveIndex(0)}
    >
      <div className="flex flex-row-reverse min-h-[300px]">
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
              <li
                key={cat.title}
                onMouseEnter={() => setActiveIndex(index)}
                className={`px-6 py-3 cursor-pointer text-sm font-medium transition-colors border-r-2
                  ${
                    activeIndex === index
                      ? 'bg-white text-pink-600 border-pink-600 shadow-sm'
                      : 'text-gray-700 hover:bg-white border-transparent hover:text-pink-500'
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
