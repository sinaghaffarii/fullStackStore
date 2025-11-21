export type ColorType = 'blue' | 'orange' | 'red' | 'yellow';

export interface ColorClasses {
  bg: string;
  text: string;
  border: string;
}

const COLOR_MAP: Record<ColorType, ColorClasses> = {
  red: {
    bg: 'bg-red-50',
    text: 'text-red-700',
    border: 'border-red-200',
  },
  blue: {
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    border: 'border-blue-200',
  },
  orange: {
    bg: 'bg-orange-50',
    text: 'text-orange-700',
    border: 'border-orange-200',
  },
  yellow: {
    bg: 'bg-yellow-50',
    text: 'text-yellow-700',
    border: 'border-yellow-200',
  },
};

export function getColorClasses(color: string): ColorClasses {
  return COLOR_MAP[color as ColorType] || COLOR_MAP.yellow;
}
