/* eslint-disable max-lines */
/* eslint-disable max-lines-per-function */
'use client';
import {
  ChevronDownIcon,
  Menu,
  MessagesSquareIcon,
  SearchIcon,
  ShoppingBasket,
  StarIcon,
  UserIcon,
} from 'lucide-react';
import { useRef, useState } from 'react';
import { useClickAway } from 'react-use';

import { useMobile } from '@/hooks/useMobile';

import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import MegaMenu from '../ui/MegaMenu';
import { Separator } from '../ui/Separator';
import MobileSidebar from './MobileSidebar';

const useHoverMenu = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 200);
  };

  useClickAway(ref, () => setIsOpen(false));

  return { ref, isOpen, handleMouseEnter, handleMouseLeave };
};

const Header = () => {
  const {
    ref: menuRef,
    isOpen: showMegaMenu,
    handleMouseEnter,
    handleMouseLeave,
  } = useHoverMenu();

  const isMobile = useMobile();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <header className="relative z-50 border-b border-gray-200 bg-white">
      <nav className="container mx-auto px-4">
        {/* ردیف اول - دسکتاپ */}
        {!isMobile ? (
          <div className="flex items-center justify-between py-4">
            <h1 className="text-2xl font-bold whitespace-nowrap text-primary">
              FaranArayeshi
            </h1>

            <div className="flex items-center gap-3">
              <Button
                className="flex items-center gap-2 bg-white transition-colors hover:bg-gray-50"
                variant="outline"
              >
                <UserIcon className="size-5" />
                <span className="hidden sm:inline">
                  سلام فاران آرایشیی عزیز
                </span>
              </Button>

              <Separator className="h-6 bg-gray-300" orientation="vertical" />

              <Button
                className="relative bg-white px-2 text-gray-500 transition-colors hover:bg-gray-50"
                variant="outline"
              >
                <ShoppingBasket className="size-6" />
                <span className="absolute -top-2 -right-2 flex size-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                  3
                </span>
              </Button>
            </div>
          </div>
        ) : (
          // ردیف اول - موبایل (برگر سمت راست، لوگو وسط، آیکون‌ها سمت چپ)
          <div className="flex items-center justify-between py-3">
            {/* سمت راست: منوی برگر */}
            <Button
              aria-label="منو"
              className="p-2"
              variant="ghost"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="size-6" />
            </Button>

            {/* وسط: لوگو */}
            <h1 className="flex-1 text-center text-xl font-bold whitespace-nowrap text-primary">
              FaranArayeshi
            </h1>

            {/* سمت چپ: پروفایل و سبد خرید */}
            <div className="flex items-center gap-1">
              <Button size="sm" className="p-2 text-gray-600" variant="ghost">
                <UserIcon className="size-5" />
              </Button>

              <Button
                size="sm"
                className="relative p-2 text-gray-600"
                variant="ghost"
              >
                <ShoppingBasket className="size-5" />
                <span className="absolute -top-1 -right-1 flex size-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                  3
                </span>
              </Button>
            </div>
          </div>
        )}

        {/* ردیف دوم - نویگیشن و جستجو */}
        {!isMobile ? (
          <div className="relative flex flex-col items-center justify-between gap-4 border-t border-gray-100 py-2 md:flex-row">
            <div className="flex w-full items-center gap-3 md:w-auto">
              <div
                ref={menuRef}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <Button
                  className="whitespace-nowrap text-gray-500 hover:text-pink-600"
                  variant="ghost"
                  icon={<ChevronDownIcon className="size-5" />}
                >
                  دسته‌بندی محصولات
                </Button>

                {showMegaMenu && (
                  <div className="absolute top-full right-0 z-50 mt-2 w-full">
                    <MegaMenu />
                  </div>
                )}
              </div>

              <Separator className="h-6" orientation="vertical" />

              <Button
                className="whitespace-nowrap text-gray-500 hover:text-pink-600"
                variant="ghost"
                icon={<StarIcon className="size-5" />}
              >
                برندها
              </Button>

              <Separator orientation="vertical" />

              <Button
                className="whitespace-nowrap text-gray-500 hover:text-primary"
                variant="ghost"
                icon={<MessagesSquareIcon className="size-5" />}
              >
                مشاوره رایگان
              </Button>

              <Separator orientation="vertical" />

              <Button
                className="whitespace-nowrap text-gray-500 hover:text-primary"
                variant="ghost"
              >
                فروش ویژه فاران آرایشی
              </Button>
            </div>

            <div className="w-full md:w-80 lg:w-[500px]">
              <Input
                className="h-10 border bg-white transition-all focus:ring-2 focus:ring-primary"
                iconPosition="right"
                placeholder="جستجوی نام محصول، دسته‌بندی و ..."
                rightIcon={<SearchIcon className="size-5 text-gray-400" />}
              />
            </div>
          </div>
        ) : (
          // ردیف دوم - موبایل: فقط جستجو
          <div className="pb-3">
            <Input
              className="h-10 border bg-white text-sm transition-all focus:ring-2 focus:ring-primary"
              iconPosition="right"
              placeholder="جستجوی محصولات..."
              rightIcon={<SearchIcon className="size-5 text-gray-400" />}
            />
          </div>
        )}

        <MobileSidebar
          onClose={() => setSidebarOpen(false)}
          open={sidebarOpen}
        />
      </nav>
    </header>
  );
};

export default Header;
