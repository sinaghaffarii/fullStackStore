'use client';
import { useState } from 'react';
import { X, ChevronLeft, ShoppingBag, User, Heart } from 'lucide-react';
import { Button } from '../ui/button';
import Link from 'next/link';
import { menuData } from '../ui/megaMenu';

interface MenuItem {
  title: string;
  href?: string;
  children?: MenuItem[];
  icon?: string;
}

interface Category {
  title: string;
  children: MenuItem[];
}

const MenuItem = ({
  item,
  level = 0,
  openMap,
  onToggle,
  onClose,
}: {
  item: MenuItem;
  level?: number;
  openMap: Record<string, boolean>;
  onToggle: (id: string) => void;
  onClose: () => void;
}) => {
  const hasChildren = item.children && item.children.length > 0;
  const isOpen = openMap[item.title];
  const paddingLeft = level * 16;

  return (
    <div className="w-full">
      <div className="flex items-center justify-between w-full">
        {hasChildren ? (
          <button
            className={`flex items-center justify-between w-full py-3 text-right transition-all duration-200 hover:bg-gray-50 ${
              level > 0 ? 'text-gray-600' : 'text-gray-800 font-medium'
            }`}
            style={{ paddingLeft: `${paddingLeft}px` }}
            onClick={() => onToggle(item.title)}
          >
            <span className="text-sm flex-1 text-right">{item.title}</span>
            <ChevronLeft
              className={`w-4 h-4 transition-transform duration-300 ${
                isOpen ? 'rotate-270' : 'rotate-180'
              }`}
            />
          </button>
        ) : (
          <Link
            href={item.href || '#'}
            className={`block w-full py-3 text-right transition-all duration-200 hover:bg-gray-50 ${
              level > 0 ? 'text-gray-600' : 'text-gray-800 font-medium'
            }`}
            style={{ paddingLeft: `${paddingLeft}px` }}
            onClick={onClose}
          >
            <span className="text-sm">{item.title}</span>
          </Link>
        )}
      </div>

      {/* نمایش زیرمنوها به صورت بازگشتی */}
      {hasChildren && isOpen && (
        <div
          className={`${level > 0 ? 'bg-gray-25' : 'bg-gray-50'} border-r-2 border-pink-100`}
        >
          {item.children?.map((child) => (
            <MenuItem
              key={child.title}
              item={child}
              level={level + 1}
              openMap={openMap}
              onToggle={onToggle}
              onClose={onClose}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default function MobileSidebar({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [openMap, setOpenMap] = useState<Record<string, boolean>>({});

  const toggle = (id: string) => {
    setOpenMap((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const closeAll = () => {
    setOpenMap({});
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Overlay با انیمیشن */}
      <div
        className="fixed inset-0 bg-black/40 transition-opacity duration-300"
        onClick={closeAll}
      />

      {/* سایدبار با انیمیشن اسلاید */}
      <aside className="relative w-80 max-w-[85vw] bg-white h-full shadow-xl transform transition-transform duration-300 ease-in-out ml-auto">
        {/* هدر سایدبار */}
        <div className="p-4 flex items-center justify-between border-b border-gray-100 bg-white sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-pink-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-bold">ف</span>
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-800">فاران گالری</h2>
              <p className="text-xs text-gray-500">
                فروشگاه تخصصی آرایشی و بهداشتی
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            onClick={closeAll}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="بستن منو"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        <nav className="h-[calc(100vh-140px)] overflow-y-auto pb-4">
          <div className="p-4 bg-linear-to-l from-pink-50 to-white border-b border-gray-100">
            <div className="flex items-center gap-4 mb-3">
              <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-pink-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800">
                  سلام فارانی عزیز
                </p>
                <p className="text-xs text-gray-500">خوش آمدید</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1 text-xs h-8"
              >
                <User className="w-3 h-3 ml-1" />
                پروفایل
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex-1 text-xs h-8"
              >
                <Heart className="w-3 h-3 ml-1" />
                علاقه‌مندی
              </Button>
            </div>
          </div>

          <div className="py-2">
            <div className="px-4 py-2">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">
                دسته‌بندی محصولات
              </h3>
            </div>

            {menuData.map((item, index) => (
              <div
                key={item.title}
                className="border-b border-gray-100 last:border-b-0"
              >
                <MenuItem
                  item={item}
                  openMap={openMap}
                  onToggle={toggle}
                  onClose={closeAll}
                />
              </div>
            ))}
          </div>

          <div className="px-4 py-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">
              سایر بخش‌ها
            </h3>
            <div className="space-y-2">
              <Link
                href="/brands"
                onClick={closeAll}
                className="flex items-center justify-between py-2 text-sm text-gray-600 hover:text-pink-600 transition-colors"
              >
                <span>برندها</span>
                <ShoppingBag className="w-4 h-4" />
              </Link>
              <Link
                href="/consultation"
                onClick={closeAll}
                className="flex items-center justify-between py-2 text-sm text-gray-600 hover:text-pink-600 transition-colors"
              >
                <span>مشاوره رایگان</span>
                <User className="w-4 h-4" />
              </Link>
              <Link
                href="/sale"
                onClick={closeAll}
                className="flex items-center justify-between py-2 text-sm text-gray-600 hover:text-pink-600 transition-colors"
              >
                <span>فروش ویژه</span>
                <Heart className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </nav>

        {/* فوتر سایدبار */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-100 bg-white">
          <div className="space-y-2">
            <Button
              variant="default"
              className="w-full justify-center gap-2 bg-pink-600 hover:bg-pink-700 h-10"
              onClick={closeAll}
            >
              <ShoppingBag className="w-4 h-4" />
              <span>مشاهده سبد خرید (۳)</span>
            </Button>
            <div className="flex gap-2 text-xs text-gray-500 justify-center">
              <Link
                href="/about"
                onClick={closeAll}
                className="hover:text-pink-600"
              >
                درباره ما
              </Link>
              <span>•</span>
              <Link
                href="/contact"
                onClick={closeAll}
                className="hover:text-pink-600"
              >
                تماس با ما
              </Link>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}
