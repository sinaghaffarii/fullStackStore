'use client';

import type { Variants } from 'framer-motion';

import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, Heart, ShoppingBag, User, X } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

import type { MenuItem } from '@/utils/menu-transformer';

import { useGetCategoryHierarchy } from '@/services/Category';
import { transformCategoriesToMenuItems } from '@/utils/menu-transformer';

import { Button } from '../ui/Button';

const ANIMATION_CONFIG = {
  spring: { type: 'spring' as const, stiffness: 300, damping: 30 },
  smooth: { duration: 0.3, ease: 'easeInOut' as const },
};

const overlayVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

const sidebarVariants: Variants = {
  hidden: { x: '100%' },
  visible: { x: 0, transition: ANIMATION_CONFIG.spring },
  exit: { x: '100%', transition: ANIMATION_CONFIG.spring },
};

const submenuVariants: Variants = {
  hidden: { height: 0, opacity: 0 },
  visible: { height: 'auto', opacity: 1, transition: ANIMATION_CONFIG.smooth },
  exit: { height: 0, opacity: 0, transition: ANIMATION_CONFIG.smooth },
};

interface MenuItemProps {
  item: MenuItem;
  level?: number;
  openMap: Record<string, boolean>;
  onToggle: (id: string) => void;
  onClose: () => void;
}

function MenuItemComponent({
  item,
  level = 0,
  openMap,
  onToggle,
  onClose,
}: MenuItemProps) {
  const hasChildren = !!item.children?.length;
  const isOpen = openMap[item.title];

  return (
    <div>
      {hasChildren ? (
        <Button
          style={{ paddingLeft: `${level * 16}px` }}
          variant="ghost"
          onClick={() => onToggle(item.title)}
          className={`flex w-full items-center justify-between rounded-none py-3 text-right hover:bg-gray-50 ${
            level > 0 ? 'text-gray-600' : 'font-medium text-gray-800'
          }`}
        >
          <span className="flex-1 text-right text-sm">{item.title}</span>
          <motion.div
            animate={{ rotate: isOpen ? -90 : 0 }}
            transition={ANIMATION_CONFIG.smooth}
          >
            <ChevronLeft className="size-4" />
          </motion.div>
        </Button>
      ) : (
        <Link
          href={item.href}
          style={{ paddingLeft: `${level * 16}px` }}
          onClick={onClose}
          className={`block w-full py-3 text-right hover:bg-gray-50 ${
            level > 0 ? 'text-gray-600' : 'font-medium text-gray-800'
          }`}
        >
          <span className="text-sm">{item.title}</span>
        </Link>
      )}

      <AnimatePresence initial={false}>
        {hasChildren && isOpen && (
          <motion.div
            animate="visible"
            className={`overflow-hidden border-r-2 border-pink-100 ps-2 ${level > 0 ? 'bg-gray-25' : 'bg-gray-50'}`}
            exit="exit"
            initial="hidden"
            variants={submenuVariants}
          >
            {item.children?.map((child) => (
              <MenuItemComponent
                item={child}
                key={child.href}
                level={level + 1}
                onClose={onClose}
                onToggle={onToggle}
                openMap={openMap}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function SidebarHeader({ onClose }: { onClose: () => void }) {
  return (
    <motion.div
      animate={{ opacity: 1, y: 0 }}
      className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-100 bg-white p-4"
      initial={{ opacity: 0, y: -20 }}
      transition={{ ...ANIMATION_CONFIG.smooth, delay: 0.1 }}
    >
      <div className="flex items-center gap-3">
        <motion.div
          animate={{ scale: 1 }}
          className="flex size-8 items-center justify-center rounded-full bg-pink-600"
          initial={{ scale: 0 }}
          transition={{ ...ANIMATION_CONFIG.spring, delay: 0.2 }}
        >
          <span className="text-sm font-bold text-white">ف</span>
        </motion.div>
        <div>
          <h2 className="text-lg font-bold text-gray-800">
            فاران آرایشی گالری
          </h2>
          <p className="text-xs text-gray-500">
            فروشگاه تخصصی آرایشی و بهداشتی
          </p>
        </div>
      </div>
      <Button
        aria-label="بستن منو"
        className="rounded-lg p-2 hover:bg-gray-100"
        variant="ghost"
        onClick={onClose}
      >
        <X className="size-5" />
      </Button>
    </motion.div>
  );
}

function SidebarUserSection() {
  return (
    <motion.div
      animate={{ opacity: 1, x: 0 }}
      className="mb-2 border-b border-gray-100 bg-linear-to-l from-pink-50 to-white p-4"
      initial={{ opacity: 0, x: 20 }}
      transition={{ ...ANIMATION_CONFIG.smooth, delay: 0.2 }}
    >
      <div className="mb-3 flex items-center gap-4">
        <motion.div
          animate={{ scale: 1 }}
          className="flex size-10 items-center justify-center rounded-full bg-pink-100"
          initial={{ scale: 0 }}
          transition={{ ...ANIMATION_CONFIG.spring, delay: 0.3 }}
        >
          <User className="size-5 text-pink-600" />
        </motion.div>
        <div>
          <p className="text-sm font-medium text-gray-800">
            سلام فاران آرایشیی عزیز
          </p>
          <p className="text-xs text-gray-500">خوش آمدید</p>
        </div>
      </div>
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="flex gap-2"
        initial={{ opacity: 0, y: 10 }}
        transition={{ ...ANIMATION_CONFIG.smooth, delay: 0.4 }}
      >
        <Button size="sm" className="h-8 flex-1 text-xs" variant="outline">
          <User className="ml-1 size-3" />
          پروفایل
        </Button>
        <Button size="sm" className="h-8 flex-1 text-xs" variant="outline">
          <Heart className="ml-1 size-3" />
          علاقه‌مندی
        </Button>
      </motion.div>
    </motion.div>
  );
}

const NAVIGATION_LINKS = [
  { href: '/brands', label: 'برندها', icon: ShoppingBag },
  { href: '/consultation', label: 'مشاوره رایگان', icon: User },
  { href: '/sale', label: 'فروش ویژه', icon: Heart },
] as const;

function SidebarMenu({
  menuItems,
  openMap,
  toggle,
  closeAll,
}: {
  menuItems: MenuItem[];
  openMap: Record<string, boolean>;
  toggle: (id: string) => void;
  closeAll: () => void;
}) {
  if (!menuItems.length) {
    return (
      <motion.div
        animate={{ opacity: 1 }}
        className="py-8 text-center text-sm text-gray-500"
        initial={{ opacity: 0 }}
      >
        دسته‌بندی‌ای یافت نشد
      </motion.div>
    );
  }

  return (
    <motion.div
      animate={{ opacity: 1 }}
      className="py-2"
      initial={{ opacity: 0 }}
      transition={{ ...ANIMATION_CONFIG.smooth, delay: 0.3 }}
    >
      <div className="px-4 py-2">
        <h3 className="mb-2 text-sm font-semibold text-gray-700">
          دسته‌بندی محصولات
        </h3>
      </div>
      {menuItems.map((item, index) => (
        <motion.div
          animate={{ opacity: 1, x: 0 }}
          className="border-b border-gray-100 last:border-b-0"
          initial={{ opacity: 0, x: 20 }}
          key={item.href}
          transition={{ ...ANIMATION_CONFIG.smooth, delay: 0.4 + index * 0.05 }}
        >
          <MenuItemComponent
            item={item}
            onClose={closeAll}
            onToggle={toggle}
            openMap={openMap}
          />
        </motion.div>
      ))}
    </motion.div>
  );
}

function SidebarOtherLinks({ closeAll }: { closeAll: () => void }) {
  return (
    <motion.div
      animate={{ opacity: 1, y: 0 }}
      className="p-4"
      initial={{ opacity: 0, y: 20 }}
      transition={{ ...ANIMATION_CONFIG.smooth, delay: 0.5 }}
    >
      <h3 className="mb-3 text-sm font-semibold text-gray-700">سایر بخش‌ها</h3>
      <div className="space-y-2">
        {NAVIGATION_LINKS.map((link, index) => (
          <motion.div
            animate={{ opacity: 1, x: 0 }}
            initial={{ opacity: 0, x: -20 }}
            key={link.href}
            transition={{
              ...ANIMATION_CONFIG.smooth,
              delay: 0.6 + index * 0.1,
            }}
          >
            <Link
              className="flex items-center justify-between py-2 text-sm text-gray-600 hover:text-pink-600"
              href={link.href}
              onClick={closeAll}
            >
              <span>{link.label}</span>
              <link.icon className="size-4" />
            </Link>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

function SidebarFooter({ closeAll }: { closeAll: () => void }) {
  return (
    <motion.div
      animate={{ opacity: 1, y: 0 }}
      className="absolute right-0 bottom-0 left-0 border-t border-gray-100 bg-white p-4"
      initial={{ opacity: 0, y: 20 }}
      transition={{ ...ANIMATION_CONFIG.smooth, delay: 0.7 }}
    >
      <Button
        className="mb-2 h-10 w-full justify-center gap-2 bg-pink-600 hover:bg-pink-700"
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
    </motion.div>
  );
}

function SidebarMenuSkeleton() {
  return (
    <div className="space-y-2 p-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <motion.div
          animate={{ opacity: 1, x: 0 }}
          className="h-10 animate-pulse rounded-sm bg-gray-200"
          initial={{ opacity: 0, x: 20 }}
          key={i}
          transition={{ ...ANIMATION_CONFIG.smooth, delay: i * 0.1 }}
        />
      ))}
    </div>
  );
}

export default function MobileSidebar({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [openMap, setOpenMap] = useState<Record<string, boolean>>({});
  const { data: categories, isLoading } = useGetCategoryHierarchy();

  const menuItems = transformCategoriesToMenuItems(categories?.data ?? []);

  const toggle = (id: string) =>
    setOpenMap((prev) => ({ ...prev, [id]: !prev[id] }));

  const closeAll = () => {
    setOpenMap({});
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex">
          <motion.div
            animate="visible"
            className="fixed inset-0 bg-black/40"
            exit="exit"
            initial="hidden"
            tabIndex={0}
            variants={overlayVariants}
            onClick={closeAll}
            onKeyDown={(e) => e.key === 'Enter' && closeAll()}
            role="button"
            transition={ANIMATION_CONFIG.smooth}
          />
          <motion.aside
            animate="visible"
            className="relative ml-auto h-full w-80 max-w-[85vw] bg-white shadow-xl"
            exit="exit"
            initial="hidden"
            variants={sidebarVariants}
          >
            <SidebarHeader onClose={closeAll} />
            <nav className="h-[calc(100vh-140px)] overflow-y-auto pb-4">
              <SidebarUserSection />
              {isLoading ? (
                <SidebarMenuSkeleton />
              ) : (
                <SidebarMenu
                  menuItems={menuItems}
                  closeAll={closeAll}
                  openMap={openMap}
                  toggle={toggle}
                />
              )}
              <SidebarOtherLinks closeAll={closeAll} />
            </nav>
            <SidebarFooter closeAll={closeAll} />
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}
