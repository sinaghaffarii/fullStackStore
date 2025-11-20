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
      href={href}
      className="group flex flex-col bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden h-full"
    >
      {/* Image Container */}
      <div className="relative p-4">
        <div className="relative aspect-square">
          <img
            src={`${image}?w=300`}
            alt={name}
            className="w-full h-full object-contain transition-transform group-hover:scale-105"
            loading="lazy"
          />
        </div>

        {/* Discount Badge */}
        <div className="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-md">
          {discountPercentage}٪
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-4 pt-0">
        {/* Brand */}
        <span className="text-xs text-gray-500 mb-1">{brand}</span>

        {/* Product Name */}
        <h3 className="text-sm text-gray-800 line-clamp-2 mb-3 leading-5 flex-1">
          {name}
        </h3>

        {/* Pricing */}
        <div className="flex items-center justify-between mt-auto">
          <div className="flex items-center gap-1">
            {/* Discounted Price */}
            <span className="text-lg font-bold text-gray-900">
              {formatPrice(discountedPrice)}
            </span>

            {/* Currency Icon */}
            <svg
              className="w-4 h-4 text-gray-900"
              viewBox="0 0 24 24"
              fill="currentColor"
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
