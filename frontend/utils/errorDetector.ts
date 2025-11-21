export interface ErrorData {
  type: string;
  icon: string;
  title: string;
  description: string;
  color: string;
}

const ERROR_CONFIGS: Record<string, ErrorData> = {
  notfound: {
    type: 'notfound',
    icon: '���',
    title: 'منبع پیدا نشد',
    description: 'صفحه یا منبعی که دنبال آن هستی وجود ندارد.',
    color: 'blue',
  },
  auth: {
    type: 'auth',
    icon: '���',
    title: 'دسترسی غیرمجاز',
    description:
      'شما اجازه دسترسی به این منبع را ندارید. لطفا وارد حساب خود شوید.',
    color: 'red',
  },
  network: {
    type: 'network',
    icon: '���',
    title: 'مشکل در اتصال',
    description: 'ارتباط با سرور قطع شده است. اتصال اینترنت خود را بررسی کن.',
    color: 'orange',
  },
  server: {
    type: 'server',
    icon: '���',
    title: 'خطای سرور',
    description: 'سرور دچار مشکل شده است. لطفا بعدا دوباره تلاش کن.',
    color: 'red',
  },
  validation: {
    type: 'validation',
    icon: '✓',
    title: 'خطای اعتبار سنجی',
    description: 'داده های ارسالی نامعتبر هستند. لطفا اطلاعات خود را بررسی کن.',
    color: 'orange',
  },
  quota: {
    type: 'quota',
    icon: '���',
    title: 'حد مجاز تجاوز شد',
    description:
      'شما از حد مجاز درخواست ها استفاده کرده اید. لطفا بعدا تلاش کن.',
    color: 'red',
  },
  unknown: {
    type: 'unknown',
    icon: '⚠️',
    title: 'خطایی رخ داده است',
    description: 'متاسفانه یک خطای غیرمنتظره رخ داده است. لطفا دوباره تلاش کن.',
    color: 'yellow',
  },
};

// eslint-disable-next-line complexity
export function detectError(error: Error): ErrorData {
  const errorMessage = error.message?.toLowerCase() || '';

  if (errorMessage.includes('not found') || errorMessage.includes('404')) {
    return ERROR_CONFIGS.notfound;
  }

  if (
    errorMessage.includes('unauthorized') ||
    errorMessage.includes('401') ||
    errorMessage.includes('forbidden') ||
    errorMessage.includes('403')
  ) {
    return ERROR_CONFIGS.auth;
  }

  if (
    errorMessage.includes('timeout') ||
    errorMessage.includes('network') ||
    errorMessage.includes('econnrefused')
  ) {
    return ERROR_CONFIGS.network;
  }

  if (
    errorMessage.includes('server') ||
    errorMessage.includes('500') ||
    errorMessage.includes('internal')
  ) {
    return ERROR_CONFIGS.server;
  }

  if (errorMessage.includes('validation') || errorMessage.includes('invalid')) {
    return ERROR_CONFIGS.validation;
  }

  if (errorMessage.includes('quota') || errorMessage.includes('limit')) {
    return ERROR_CONFIGS.quota;
  }

  return ERROR_CONFIGS.unknown;
}
