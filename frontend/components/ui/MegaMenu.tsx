'use client';

import Link from 'next/link';
import { useState } from 'react';

import type { MenuCategory, MenuItem } from '@/utils/menu-transformer';

import { useGetCategoryHierarchy } from '@/services/Category';
import { transformCategoriesToMenuData } from '@/utils/menu-transformer';

interface SubcategoriesProps {
  items: MenuItem[];
  level?: number;
}

function Subcategories({ items, level = 0 }: SubcategoriesProps) {
  return (
    <>
      {items.map((item) => (
        <div
          className={level > 0 ? 'mr-2 border-r-2 border-pink-100' : ''}
          key={item.href}
        >
          <Link
            href={item.href}
            className={`block rounded-md px-3 py-2 font-medium transition-colors duration-200 ${
              level === 0
                ? 'text-sm text-gray-700 hover:bg-pink-50 hover:text-pink-600'
                : 'text-xs text-gray-600 hover:text-pink-500'
            }`}
          >
            {item.title}
          </Link>
          {item.children && (
            <Subcategories items={item.children} level={level + 1} />
          )}
        </div>
      ))}
    </>
  );
}

function MegaMenuSkeleton() {
  return (
    <div className="max-w-[800px] overflow-hidden rounded-b-lg border border-t-0 bg-white shadow-lg">
      <div className="flex min-h-[300px] flex-row-reverse">
        <div className="w-2/3 p-4">
          <div className="grid grid-cols-2 gap-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                className="h-8 animate-pulse rounded-sm bg-gray-200"
                key={i}
              />
            ))}
          </div>
        </div>
        <div className="w-1/3 border-l border-gray-100 bg-gray-50 py-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              className="mx-4 my-2 h-10 animate-pulse rounded-sm bg-gray-200"
              key={i}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function MegaMenuEmpty() {
  return (
    <div className="max-w-[800px] overflow-hidden rounded-b-lg border border-t-0 bg-white p-8 text-center shadow-lg">
      <p className="text-gray-500">دسته‌بندی‌ای یافت نشد</p>
    </div>
  );
}

interface MegaMenuContentProps {
  menuData: MenuCategory[];
}

function MegaMenuContent({ menuData }: MegaMenuContentProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  const activeCategory = menuData[activeIndex];

  return (
    <div
      className="max-w-[800px] overflow-hidden rounded-b-lg border border-t-0 bg-white shadow-lg"
      onMouseLeave={() => setActiveIndex(0)}
    >
      <div className="flex min-h-[300px] flex-row-reverse">
        <div className="w-2/3 p-2">
          {activeCategory?.children.length ? (
            <div className="grid grid-cols-2 gap-3">
              <Subcategories items={activeCategory.children} />
            </div>
          ) : (
            <div className="flex h-full items-center justify-center text-gray-400">
              زیردسته‌ای وجود ندارد
            </div>
          )}
        </div>

        <div className="w-1/3 border-l border-gray-100 bg-gray-50">
          <ul className="">
            {menuData.map((cat, index) => (
              <li
                key={cat.href}
                onMouseEnter={() => setActiveIndex(index)}
                className={`cursor-pointer border-r-2 px-6 py-3 text-sm font-medium transition-colors ${
                  activeIndex === index
                    ? 'border-pink-600 bg-white text-pink-600 shadow-sm'
                    : 'border-transparent text-gray-700 hover:bg-white hover:text-pink-500'
                }`}
              >
                <Link className="block" href={cat.href}>
                  {cat.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default function MegaMenu() {
  const { data: categories, isLoading } = useGetCategoryHierarchy();

  if (isLoading) return <MegaMenuSkeleton />;

  const menuData = transformCategoriesToMenuData(categories?.data ?? []);

  if (!menuData.length) return <MegaMenuEmpty />;

  return <MegaMenuContent menuData={menuData} />;
}
