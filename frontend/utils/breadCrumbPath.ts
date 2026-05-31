export const BREADCRUMB_ROUTES = {
  dashboard: 'داشبورد',
  products: 'محصولات',
  categories: 'دسته‌بندی‌ها',
  users: 'کاربران',
  settings: 'تنظیمات',
  edit: 'ویرایش',
  add: 'افزودن',
  create: 'ایجاد جدید',
  view: 'مشاهده',
} as const;

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export const getBreadcrumbLabel = (segment: string): string | null => {
  if (BREADCRUMB_ROUTES[segment as keyof typeof BREADCRUMB_ROUTES]) {
    return BREADCRUMB_ROUTES[segment as keyof typeof BREADCRUMB_ROUTES];
  }

  if (UUID_REGEX.test(segment)) {
    return null;
  }

  return segment.charAt(0).toUpperCase() + segment.slice(1);
};

interface BreadPart {
  label: string;
  href: string;
}

export const getPathNameForBreadCrumb = (pathName: string): BreadPart[] => {
  const segments = pathName.split('/').filter(Boolean);
  const result: BreadPart[] = [];
  let currentPath = '';

  segments.forEach((segment) => {
    currentPath = `/${currentPath ? `${currentPath.slice(1)}/` : ''}${segment}`;
    const label = getBreadcrumbLabel(segment);

    if (label === null) {
      return;
    }

    result.push({
      label,
      href: currentPath,
    });
  });
  return result;
};
