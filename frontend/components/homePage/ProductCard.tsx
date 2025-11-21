import React from 'react';

interface ProductCardProps {
  id: number;
  name: string;
  brand: string;
  image: string;
  originalPrice: number;
  discountedPrice: number;
  discountPercentage: number;
  href: string;
}

const ProductCard: React.FC<ProductCardProps> = ({
  name,
  brand,
  image,
  originalPrice,
  discountedPrice,
  discountPercentage,
  href,
}) => {
  const formatPrice = (price: number) => {
    return price.toLocaleString('fa-IR');
  };

  return (
    <a
      className="group flex h-full flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:shadow-md"
      href={href}
    >
      {/* Image Container */}
      <div className="relative p-4">
        <div className="relative aspect-square">
          <img
            alt={name}
            className="size-full object-contain transition-transform group-hover:scale-105"
            src={`${image}?w=300`}
            loading="lazy"
          />
        </div>

        {/* Discount Badge */}
        <div className="absolute top-2 left-2 rounded-md bg-red-600 px-2 py-1 text-xs font-bold text-white">
          {discountPercentage}٪
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-4 pt-0">
        {/* Brand */}
        <span className="mb-1 text-xs text-gray-500">{brand}</span>

        {/* Product Name */}
        <h3 className="mb-3 line-clamp-2 flex-1 text-sm leading-5 text-gray-800">
          {name}
        </h3>

        {/* Pricing */}
        <div className="mt-auto flex items-center justify-between">
          <div className="flex items-center gap-1">
            {/* Discounted Price */}
            <span className="text-lg font-bold text-gray-900">
              {formatPrice(discountedPrice)}
            </span>

            {/* Currency Icon */}
            <svg
              className="size-4 text-gray-900"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 16v-6H8v-2h3V8h2v2h3v2h-3v6h-2z" />
            </svg>
          </div>

          {/* Original Price */}
          <span className="text-xs text-gray-400 line-through">
            {formatPrice(originalPrice)}
          </span>
        </div>
      </div>
    </a>
  );
};

export default ProductCard;
