'use client';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import {
  ChevronDownIcon,
  MessagesSquareIcon,
  RssIcon,
  SearchIcon,
  ShoppingBasket,
  StarIcon,
  UserIcon,
} from 'lucide-react';
import { Separator } from '../ui/separator';
import MegaMenu from '../ui/megaMenu';
import { useRef, useState } from 'react';
import { useClickAway } from 'react-use';

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

  return (
    <header className="border-b border-gray-200 relative z-50 bg-white">
      <nav className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          <h1 className="text-2xl font-bold text-primary whitespace-nowrap">
            FaranGallery
          </h1>

          <div className="flex items-center gap-3">
            <Button
              size="lg"
              variant="outline"
              className="flex items-center gap-2 hover:bg-gray-50 transition-colors"
            >
              <UserIcon className="w-5 h-5" />
              <span className="hidden sm:inline">سلام فارانی عزیز</span>
            </Button>

            <Separator orientation="vertical" className="h-6 bg-gray-300" />

            <Button
              variant="outline"
              size="lg"
              className="relative text-gray-500 hover:bg-gray-50 transition-colors !px-2"
            >
              <ShoppingBasket className="size-6" />
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                3
              </span>
            </Button>
          </div>
        </div>

        <div className="relative flex flex-col md:flex-row items-center justify-between gap-4 border-t border-gray-100 py-2">
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div
              ref={menuRef}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <Button
                icon={<ChevronDownIcon className="size-5" />}
                variant="ghost"
                className="text-gray-500 hover:text-pink-600 whitespace-nowrap"
              >
                دسته‌بندی محصولات
              </Button>

              {showMegaMenu && (
                <div className="absolute right-0 top-full w-full mt-2 z-50">
                  <MegaMenu />
                </div>
              )}
            </div>

            <Separator orientation="vertical" className="h-6" />
            <Button
              icon={<StarIcon className="size-5" />}
              variant="ghost"
              className="text-gray-500 hover:text-pink-600 whitespace-nowrap"
            >
              برندها
            </Button>
            <Separator orientation="vertical" />
            <Button
              icon={<MessagesSquareIcon className="size-5" />}
              variant="ghost"
              className="text-gray-500 hover:text-primary whitespace-nowrap"
            >
              مشاوره رایگان
            </Button>
            <Separator orientation="vertical" />
            <Button
              variant="ghost"
              className="text-gray-500 hover:text-primary whitespace-nowrap"
            >
              فروش ویژه فاران
            </Button>
          </div>

          <div className="w-full md:w-80 lg:w-[500px]">
            <Input
              className="bg-muted border focus:ring-2 focus:ring-primary transition-all h-12"
              iconPosition="right"
              rightIcon={<SearchIcon className="w-5 h-5 text-gray-400" />}
              placeholder="جستجوی نام محصول، دسته‌بندی و ..."
            />
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
