export const sliderConfig = {
  rtl: true,
  loop: true,
  slides: { perView: 1.2, spacing: 16 },
  breakpoints: {
    '(min-width: 640px)': { slides: { perView: 2.2, spacing: 18 } },
    '(min-width: 1024px)': { slides: { perView: 4, spacing: 20 } },
    '(min-width: 1280px)': { slides: { perView: 5, spacing: 24 } },
  },
};

export const relatedProducts = Array(8)
  .fill(null)
  .map((_, idx) => ({
    id: idx + 1,
    slug: `related-${idx + 1}`,
    name: `محصول مشابه شماره ${idx + 1}`,
    brand: 'Nutriga',
    price: 350_000 + idx * 25_000,
    originalPrice: 400_000 + idx * 25_000,
    discountedPrice: 350_000 + idx * 25_000,
    discountPercentage: idx % 2 === 0 ? 12 : 0,
    image: '/images/products/product_2.jpg',
    rating: '4.3',
    href: `/product/${idx + 1}`,
  }));
