/* eslint-disable max-lines */
'use client';
import { ChevronLeft, Heart, ShoppingBag, User, X } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

import { Button } from '../ui/button';
import { menuData } from '../ui/megaMenu';

interface MenuItemType {
  title: string;
  href?: string;
  children?: MenuItemType[];
  icon?: string;
}

const MenuItem = ({
  item,
  level = 0,
  openMap,
  onToggle,
  onClose,
}: {
  item: MenuItemType;
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
      <div className="flex w-full items-center justify-between">
        {hasChildren ? (
          <Button
            style={{ paddingLeft: `${paddingLeft}px` }}
            variant="ghost"
            onClick={() => onToggle(item.title)}
            className={`flex w-full items-center justify-between rounded-none py-3 text-right transition-all duration-200 hover:bg-gray-50 ${
              level > 0 ? 'text-gray-600' : 'font-medium text-gray-800'
            }`}
          >
            <span className="flex-1 text-right text-sm">{item.title}</span>
            <ChevronLeft
              className={`size-4 transition-transform duration-300 ${
                isOpen ? 'rotate-270' : 'rotate-180'
              }`}
            />
          </Button>
        ) : (
          <Link
            href={item.href || '#'}
            style={{ paddingLeft: `${paddingLeft}px` }}
            onClick={onClose}
            className={`block w-full py-3 text-right transition-all duration-200 hover:bg-gray-50 ${
              level > 0 ? 'text-gray-600' : 'font-medium text-gray-800'
            }`}
          >
            <span className="text-sm">{item.title}</span>
          </Link>
        )}
      </div>

      {hasChildren && isOpen && (
        <div
          className={`${level > 0 ? 'bg-gray-25' : 'bg-gray-50'} border-r-2 border-pink-100`}
        >
          {item.children?.map((child) => (
            <MenuItem
              item={child}
              key={child.title}
              level={level + 1}
              onClose={onClose}
              onToggle={onToggle}
              openMap={openMap}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const SidebarHeader = ({ onClose }: { onClose: () => void }) => (
  <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-100 bg-white p-4">
    <div className="flex items-center gap-3">
      <div className="flex size-8 items-center justify-center rounded-full bg-pink-600">
        <span className="text-sm font-bold text-white">ف</span>
      </div>
      <div>
        <h2 className="text-lg font-bold text-gray-800">فاران گالری</h2>
        <p className="text-xs text-gray-500">فروشگاه تخصصی آرایشی و بهداشتی</p>
      </div>
    </div>
    <Button
      aria-label="بستن منو"
      className="rounded-lg p-2 transition-colors hover:bg-gray-100"
      variant="ghost"
      onClick={onClose}
    >
      <X className="size-5" />
    </Button>
  </div>
);

const SidebarUserSection = () => (
  <div className="mb-2 border-b border-gray-100 bg-linear-to-l from-pink-50 to-white p-4">
    <div className="mb-3 flex items-center gap-4">
      <div className="flex size-10 items-center justify-center rounded-full bg-pink-100">
        <User className="size-5 text-pink-600" />
      </div>
      <div>
        <p className="text-sm font-medium text-gray-800">سلام فارانی عزیز</p>
        <p className="text-xs text-gray-500">خوش آمدید</p>
      </div>
    </div>
    <div className="flex gap-2">
      <Button size="sm" className="h-8 flex-1 text-xs" variant="outline">
        <User className="ml-1 size-3" />
        پروفایل
      </Button>
      <Button size="sm" className="h-8 flex-1 text-xs" variant="outline">
        <Heart className="ml-1 size-3" />
        علاقه‌مندی
      </Button>
    </div>
  </div>
);

const SidebarMenu = ({
  openMap,
  toggle,
  closeAll,
}: {
  openMap: Record<string, boolean>;
  toggle: (id: string) => void;
  closeAll: () => void;
}) => (
  <div className="py-2">
    <div className="px-4 py-2">
      <h3 className="mb-2 text-sm font-semibold text-gray-700">
        دسته‌بندی محصولات
      </h3>
    </div>
    {menuData.map((item) => (
      <div
        className="border-b border-gray-100 last:border-b-0"
        key={item.title}
      >
        <MenuItem
          item={item}
          onClose={closeAll}
          onToggle={toggle}
          openMap={openMap}
        />
      </div>
    ))}
  </div>
);

const SidebarOtherLinks = ({ closeAll }: { closeAll: () => void }) => (
  <div className="p-4">
    <h3 className="mb-3 text-sm font-semibold text-gray-700">سایر بخش‌ها</h3>
    <div className="space-y-2">
      <Link
        className="flex items-center justify-between py-2 text-sm text-gray-600 transition-colors hover:text-pink-600"
        href="/brands"
        onClick={closeAll}
      >
        <span>برندها</span>
        <ShoppingBag className="size-4" />
      </Link>
      <Link
        className="flex items-center justify-between py-2 text-sm text-gray-600 transition-colors hover:text-pink-600"
        href="/consultation"
        onClick={closeAll}
      >
        <span>مشاوره رایگان</span>
        <User className="size-4" />
      </Link>
      <Link
        className="flex items-center justify-between py-2 text-sm text-gray-600 transition-colors hover:text-pink-600"
        href="/sale"
        onClick={closeAll}
      >
        <span>فروش ویژه</span>
        <Heart className="size-4" />
      </Link>
    </div>
  </div>
);

const SidebarFooter = ({ closeAll }: { closeAll: () => void }) => (
  <div className="absolute right-0 bottom-0 left-0 border-t border-gray-100 bg-white p-4">
    <div className="space-y-2">
      <Button
        className="h-10 w-full justify-center gap-2 bg-pink-600 hover:bg-pink-700"
        variant="default"
        onClick={closeAll}
      >
        <ShoppingBag className="size-4" />
        <span>مشاهده سبد خرید (۳)</span>
      </Button>
      <div className="flex justify-center gap-2 text-xs text-gray-500">
        <Link className="hover:text-pink-600" href="/about" onClick={closeAll}>
          درباره ما
        </Link>
        <span>•</span>
        <Link
          className="hover:text-pink-600"
          href="/contact"
          onClick={closeAll}
        >
          تماس با ما
        </Link>
      </div>
    </div>
  </div>
);

export default function MobileSidebar({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [openMap, setOpenMap] = useState<Record<string, boolean>>({});

  const toggle = (id: string) =>
    setOpenMap((prev) => ({ ...prev, [id]: !prev[id] }));
  const closeAll = () => {
    setOpenMap({});
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      <div
        className="fixed inset-0 bg-black/40 transition-opacity duration-300"
        tabIndex={0}
        onClick={closeAll}
        onKeyDown={(e) => e.key === 'Enter' && closeAll()}
        role="button"
      />
      <aside className="relative ml-auto h-full w-80 max-w-[85vw] transform bg-white shadow-xl transition-transform duration-300 ease-in-out">
        <SidebarHeader onClose={closeAll} />
        <nav className="h-[calc(100vh-140px)] overflow-y-auto pb-4">
          <SidebarUserSection />
          <SidebarMenu closeAll={closeAll} openMap={openMap} toggle={toggle} />
          <SidebarOtherLinks closeAll={closeAll} />
        </nav>
        <SidebarFooter closeAll={closeAll} />
      </aside>
    </div>
  );
}
