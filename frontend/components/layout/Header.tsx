import { Input } from '../ui/input';
import { Button } from '../ui/button';
import {
  MessagesSquareIcon,
  RssIcon,
  SearchIcon,
  ShoppingBasket,
  StarIcon,
  UserIcon,
} from 'lucide-react';
import { Separator } from '../ui/separator';

const Header = () => {
  return (
    <header className="p-2 border-b border-gray-200">
      <nav className="container mx-auto px-4">
        {/* ردیف اول: لوگو و بخش کاربر */}
        <div className="flex items-center justify-between py-4">
          {/* لوگو */}
          <h1 className="text-2xl font-bold text-primary whitespace-nowrap">
            FaranGallery
          </h1>

          {/* بخش کاربر و سبد خرید */}
          <div className="flex items-center gap-3">
            <Button
              size="lg"
              variant="outline"
              className="flex items-center gap-2 hover:bg-gray-50 transition-colors"
            >
              <UserIcon className="w-5 h-5" />
              <span className="hidden sm:inline">سلام فارانی عزیز</span>
            </Button>

            <Separator
              orientation="vertical"
              decorative={true}
              className="h-6 bg-gray-300"
            />

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

        {/* ردیف دوم: جستجو و دسته‌بندی‌ها */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 py-4 border-t border-gray-100 pt-4">
          {/* دسته‌بندی‌ها */}
          <div className="flex items-center gap-4 w-full md:w-auto overflow-x-auto pb-2">
            <Button
              variant="ghost"
              className="text-gray-500 hover:text-primary whitespace-nowrap"
            >
              دسته‌بندی محصولات
            </Button>
            <Separator orientation="vertical" />
            <Button
              icon={<StarIcon className="size-5" />}
              variant="ghost"
              className="text-gray-500 hover:text-primary whitespace-nowrap"
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
              icon={<RssIcon className="size-5" />}
              variant="ghost"
              className="text-gray-500 hover:text-primary whitespace-nowrap"
            >
              وبلاگ فاران
            </Button>
            <Separator orientation="vertical" />
            <Button
              variant="ghost"
              className="text-gray-500 hover:text-primary whitespace-nowrap"
            >
              فروش ویژه فاران
            </Button>
          </div>

          {/* جستجو */}
          <div className="w-full md:w-80 lg:w-[500px]">
            <Input
              className="bg-gray-100 border-0 focus:ring-2 focus:ring-primary transition-all "
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
