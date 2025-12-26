import type { ICategory } from '@/types/category';

export interface MenuItem {
  title: string;
  href: string;
  children?: MenuItem[];
}

export interface MenuCategory {
  title: string;
  href: string;
  children: MenuItem[];
}

export function transformCategoryToMenuItem(category: ICategory): MenuItem {
  const menuItem: MenuItem = {
    title: category.name,
    href: `/products/${category.slug}`,
  };

  if (category.children?.length) {
    menuItem.children = category.children.map(transformCategoryToMenuItem);
  }

  return menuItem;
}

export function transformCategoriesToMenuData(
  categories: ICategory[],
): MenuCategory[] {
  return categories.map((category) => ({
    title: category.name,
    href: `/products/${category.slug}`,
    children: category.children?.map(transformCategoryToMenuItem) ?? [],
  }));
}

export function transformCategoriesToMenuItems(
  categories: ICategory[],
): MenuItem[] {
  return categories.map(transformCategoryToMenuItem);
}
