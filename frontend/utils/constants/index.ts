export const QUERY_KEY = Object.freeze({
  AUTH: 'AUTH',
  BRAND: 'BRAND',
  CATEGORY: 'CATEGORY',
  PRODUCT: 'PRODUCT',
  ADMIN: 'ADMIN',
});

export const ROUTE_OBJECT = Object.freeze({
  // ------- PUBLIC ROUTES ------------
  HOME: '/',
  PRODUCTS: '/products',
  CATEGORIES: '/categories',
  ABOUT: '/about',
  CONTACT: '/contact',
  PROFILE: '/profile',
  ORDERS: '/orders',
  CHECKOUT: '/checkout',
  CART: '/cart',
  // ------- AUTHENTICATION ROUTES ------------
  USER_LOGIN: '/userLogin',
  ADMIN_LOGIN: '/adminLogin',
  // ------- ROLE ADMIN ROUTES ------------
  DASHBOARD: '/dashboard',
  D_SALE_REPORT: '/dashboard/saleReport',
  D_PRODUCTS: '/dashboard/products',
  D_CATEGORIES: '/dashboard/categories',
  D_BRANDS: '/dashboard/brands',
  D_ORDERS: '/dashboard/orders',
  D_INVOICES: '/dashboard/invoices',
  D_COUPONS: '/dashboard/coupons',
  D_CUSTOMERS: '/dashboard/customers',
  D_ROLES: '/dashboard/roles',
});
