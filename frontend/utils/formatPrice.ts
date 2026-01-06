export function formatPrice(price: number, currency = 'تومان'): string {
  const toman = Math.round(price / 10);
  return `${toman.toLocaleString('fa-IR')} ${currency}`;
}

export function formatPriceRial(price: number): string {
  return `${price.toLocaleString('fa-IR')} ریال`;
}
