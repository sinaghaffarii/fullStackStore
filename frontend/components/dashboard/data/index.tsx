/* eslint-disable max-lines */

export type PaymentStatus =
  | 'cancelled' // لغو شده
  | 'failed' // ناموفق
  | 'paid' // پرداخت شده
  | 'pending' // در انتظار پرداخت
  | 'processing' // در حال پردازش
  | 'refunded'; // مسترد شده

export type OrderStatus =
  | 'cancelled' // لغو شده
  | 'confirmed' // تایید شده
  | 'delivered' // تحویل داده شده
  | 'pending' // در انتظار تایید
  | 'preparing' // در حال آماده‌سازی
  | 'shipped'; // ارسال شده

export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  image: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customer: {
    id: string;
    name: string;
    email: string;
    phone: string;
    avatar: string;
  };
  items: OrderItem[];
  totalAmount: number;
  totalItems: number;
  paymentStatus: PaymentStatus;
  paymentMethod: string;
  orderStatus: OrderStatus;
  progress: number; // 0-100
  shippingAddress: string;
  createdAt: string;
  updatedAt: string;
  estimatedDelivery: string;
  trackingCode?: string;
}

// ============================================
// Payment Status Config
// ============================================

export const paymentStatusConfig: Record<
  PaymentStatus,
  { label: string; className: string; icon: string }
> = {
  pending: {
    label: 'در انتظار پرداخت',
    className:
      'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
    icon: '⏳',
  },
  processing: {
    label: 'در حال پردازش',
    className:
      'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
    icon: '🔄',
  },
  paid: {
    label: 'پرداخت شده',
    className:
      'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    icon: '✅',
  },
  failed: {
    label: 'ناموفق',
    className: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
    icon: '❌',
  },
  refunded: {
    label: 'مسترد شده',
    className:
      'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
    icon: '↩️',
  },
  cancelled: {
    label: 'لغو شده',
    className:
      'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400',
    icon: '🚫',
  },
};

// ============================================
// Order Status Config
// ============================================

export const orderStatusConfig: Record<
  OrderStatus,
  { label: string; className: string; step: number }
> = {
  pending: {
    label: 'در انتظار تایید',
    className: 'bg-yellow-100 text-yellow-800',
    step: 1,
  },
  confirmed: {
    label: 'تایید شده',
    className: 'bg-blue-100 text-blue-800',
    step: 2,
  },
  preparing: {
    label: 'در حال آماده‌سازی',
    className: 'bg-orange-100 text-orange-800',
    step: 3,
  },
  shipped: {
    label: 'ارسال شده',
    className: 'bg-indigo-100 text-indigo-800',
    step: 4,
  },
  delivered: {
    label: 'تحویل داده شده',
    className: 'bg-green-100 text-green-800',
    step: 5,
  },
  cancelled: {
    label: 'لغو شده',
    className: 'bg-red-100 text-red-800',
    step: 0,
  },
};

// ============================================
// Fake Data Generator
// ============================================

const customerNames = [
  'علی محمدی',
  'سارا احمدی',
  'محمد رضایی',
  'زهرا کریمی',
  'امیر حسینی',
  'فاطمه نوری',
  'حسین صادقی',
  'مریم عباسی',
  'رضا جعفری',
  'نازنین موسوی',
  'مهدی اکبری',
  'لیلا رحیمی',
  'امین کاظمی',
  'پریسا شریفی',
  'سعید قاسمی',
];

const productNames = [
  'گوشی آیفون ۱۵ پرو مکس',
  'لپ‌تاپ مک‌بوک پرو ۱۶',
  'ایرپاد پرو نسل ۲',
  'اپل واچ سری ۹',
  'آیپد پرو ۱۲.۹ اینچ',
  'کیبورد مجیک اپل',
  'موس مجیک اپل',
  'شارژر مگ‌سیف',
  'کاور سیلیکونی آیفون',
  'کابل شارژ تایپ سی',
  'هدفون سونی WH-1000XM5',
  'کنسول پلی‌استیشن ۵',
  'دسته بازی دوال‌سنس',
  'مانیتور سامسونگ ۳۲ اینچ',
  'کیس کامپیوتر گیمینگ',
];

const paymentMethods = [
  'کارت به کارت',
  'درگاه زرین‌پال',
  'درگاه ملت',
  'پرداخت در محل',
  'کیف پول',
  'اقساطی',
];

const cities = [
  'تهران',
  'مشهد',
  'اصفهان',
  'شیراز',
  'تبریز',
  'کرج',
  'قم',
  'اهواز',
  'کرمانشاه',
  'رشت',
];

function generateRandomId(): string {
  return Math.random().toString(36).substring(2, 15);
}

function generateOrderNumber(): string {
  const prefix = 'ORD';
  const number = Math.floor(Math.random() * 900000) + 100000;
  return `${prefix}-${number}`;
}

function generateTrackingCode(): string {
  return Math.random().toString(36).substring(2, 12).toUpperCase();
}

function getRandomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function getRandomPrice(): number {
  const prices = [
    150000, 250000, 450000, 750000, 1200000, 2500000, 3500000, 5000000, 8000000,
    12000000, 25000000, 45000000,
  ];
  return getRandomElement(prices);
}

function getRandomDate(daysAgo: number): string {
  const date = new Date();
  date.setDate(date.getDate() - Math.floor(Math.random() * daysAgo));
  date.setHours(Math.floor(Math.random() * 24));
  date.setMinutes(Math.floor(Math.random() * 60));
  return date.toISOString();
}

function formatPersianDate(isoDate: string): string {
  const date = new Date(isoDate);
  return new Intl.DateTimeFormat('fa-IR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

function generateOrderItems(): OrderItem[] {
  const itemCount = Math.floor(Math.random() * 4) + 1;
  const items: OrderItem[] = [];

  for (let i = 0; i < itemCount; i++) {
    items.push({
      id: generateRandomId(),
      name: getRandomElement(productNames),
      quantity: Math.floor(Math.random() * 3) + 1,
      price: getRandomPrice(),
      image: `https://picsum.photos/seed/${generateRandomId()}/100/100`,
    });
  }

  return items;
}

function calculateProgress(orderStatus: OrderStatus): number {
  switch (orderStatus) {
    case 'pending':
      return 10;
    case 'confirmed':
      return 30;
    case 'preparing':
      return 50;
    case 'shipped':
      return 75;
    case 'delivered':
      return 100;
    case 'cancelled':
      return 0;
    default:
      return 0;
  }
}

function generateOrder(index: number): Order {
  const customerName = getRandomElement(customerNames);
  const items = generateOrderItems();
  const orderStatus = getRandomElement<OrderStatus>([
    'pending',
    'confirmed',
    'preparing',
    'shipped',
    'delivered',
    'cancelled',
  ]);

  // Payment status based on order status
  let paymentStatus: PaymentStatus;
  if (orderStatus === 'cancelled') {
    paymentStatus = getRandomElement<PaymentStatus>(['cancelled', 'refunded']);
  } else if (orderStatus === 'pending') {
    paymentStatus = getRandomElement<PaymentStatus>(['pending', 'processing']);
  } else {
    paymentStatus = getRandomElement<PaymentStatus>([
      'paid',
      'paid',
      'paid',
      'processing',
    ]);
  }

  const createdAt = getRandomDate(30);
  const totalAmount = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  return {
    id: generateRandomId(),
    orderNumber: generateOrderNumber(),
    customer: {
      id: generateRandomId(),
      name: customerName,
      email: `${customerName.replace(' ', '.').toLowerCase()}@example.com`,
      phone: `09${Math.floor(Math.random() * 900000000) + 100000000}`,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${customerName}`,
    },
    items,
    totalAmount,
    totalItems: items.reduce((sum, item) => sum + item.quantity, 0),
    paymentStatus,
    paymentMethod: getRandomElement(paymentMethods),
    orderStatus,
    progress: calculateProgress(orderStatus),
    shippingAddress: `${getRandomElement(cities)}، خیابان ${Math.floor(Math.random() * 100) + 1}، پلاک ${Math.floor(Math.random() * 500) + 1}`,
    createdAt,
    updatedAt: createdAt,
    estimatedDelivery: new Date(
      new Date(createdAt).getTime() + 5 * 24 * 60 * 60 * 1000,
    ).toISOString(),
    trackingCode:
      orderStatus === 'shipped' || orderStatus === 'delivered'
        ? generateTrackingCode()
        : undefined,
  };
}

// ============================================
// Generate Fake Orders
// ============================================

export function generateFakeOrders(count: number = 50): Order[] {
  return Array.from({ length: count }, (_, i) => generateOrder(i));
}

// Pre-generated data for immediate use
export const fakeOrders: Order[] = generateFakeOrders(100);

// ============================================
// API Simulation Helper
// ============================================

export interface PaginatedResponse<T> {
  data: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export function simulateApiCall(
  page: number = 1,
  pageSize: number = 10,
  delay: number = 500,
): Promise<PaginatedResponse<Order>> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const startIndex = (page - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      const paginatedData = fakeOrders.slice(startIndex, endIndex);
      const totalPages = Math.ceil(fakeOrders.length / pageSize);

      resolve({
        data: paginatedData,
        totalCount: fakeOrders.length,
        page,
        pageSize,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      });
    }, delay);
  });
}

// ============================================
// Utility Functions
// ============================================

export function formatPrice(price: number): string {
  return `${new Intl.NumberFormat('fa-IR').format(price)} تومان`;
}

export function formatRelativeTime(isoDate: string): string {
  const date = new Date(isoDate);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return 'لحظاتی پیش';
  if (diffInSeconds < 3600)
    return `${Math.floor(diffInSeconds / 60)} دقیقه پیش`;
  if (diffInSeconds < 86400)
    return `${Math.floor(diffInSeconds / 3600)} ساعت پیش`;
  if (diffInSeconds < 604800)
    return `${Math.floor(diffInSeconds / 86400)} روز پیش`;

  return formatPersianDate(isoDate);
}
