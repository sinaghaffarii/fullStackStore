import jalaali from 'jalaali-js';

export const topersianDate = (
  isoString: string,
  options?: {
    withSeconds?: boolean;
    separator?: string;
    dateFormat?: 'dash' | 'slash';
  },
): string => {
  try {
    const date = new Date(isoString);

    if (isNaN(date.getTime())) {
      throw new Error('Invalid date format');
    }

    const gregorianYear = date.getFullYear();
    const gregorianMonth = date.getMonth() + 1;
    const gregorianDay = date.getDate();

    const jalali = jalaali.toJalaali(
      gregorianYear,
      gregorianMonth,
      gregorianDay,
    );

    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');

    const dateSeparator = options?.dateFormat === 'dash' ? '-' : '/';
    const persianDate = `${jalali.jy}${dateSeparator}${String(jalali.jm).padStart(2, '0')}${dateSeparator}${String(jalali.jd).padStart(2, '0')}`;

    const timeString = options?.withSeconds
      ? `${hours}:${minutes}:${seconds}`
      : `${hours}:${minutes}`;

    const separator = options?.separator ?? ' - ';
    return `${persianDate}${separator}${timeString}`;
  } catch (error) {
    console.error('Error converting date:', error);
    return 'تاریخ نامعتبر';
  }
};

export const topersianDateOnly = (isoString: string): string => {
  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) {
      throw new Error('Invalid date format');
    }

    const gregorianYear = date.getFullYear();
    const gregorianMonth = date.getMonth() + 1;
    const gregorianDay = date.getDate();

    const jalali = jalaali.toJalaali(
      gregorianYear,
      gregorianMonth,
      gregorianDay,
    );

    return `${jalali.jy}/${String(jalali.jm).padStart(2, '0')}/${String(jalali.jd).padStart(2, '0')}`;
  } catch (error) {
    console.error('Error converting date:', error);
    return 'تاریخ نامعتبر';
  }
};

export const topersianTimeOnly = (
  isoString: string,
  withSeconds = false,
): string => {
  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) {
      throw new Error('Invalid date format');
    }

    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');

    return withSeconds
      ? `${hours}:${minutes}:${seconds}`
      : `${hours}:${minutes}`;
  } catch (error) {
    console.error('Error converting date:', error);
    return 'زمان نامعتبر';
  }
};

export const topersianRelativeDate = (isoString: string): string => {
  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) {
      throw new Error('Invalid date format');
    }

    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSeconds = Math.floor(diffMs / 1000);
    const diffMinutes = Math.floor(diffSeconds / 60);
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffSeconds < 60) {
      return 'همین الان';
    }

    if (diffMinutes < 60) {
      return `${diffMinutes} دقیقه پیش`;
    }

    if (diffHours < 24) {
      return `${diffHours} ساعت پیش`;
    }

    if (diffDays === 1) {
      return 'دیروز';
    }

    if (diffDays < 7) {
      return `${diffDays} روز پیش`;
    }

    return topersianDate(isoString);
  } catch (error) {
    console.error('Error converting date:', error);
    return 'تاریخ نامعتبر';
  }
};
