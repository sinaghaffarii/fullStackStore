import User from './auth/user.model';
import {
  Brand,
  Category,
  Product,
  ProductImage,
  ProductVariant,
} from './catalog';
import { Cart, CartItem, Discount } from './commerce';

export function setupAssociations(): void {
  // ==================== Category ====================
  Category.belongsTo(Category, { as: 'parent', foreignKey: 'parent_id' });
  Category.hasMany(Category, { as: 'children', foreignKey: 'parent_id' });
  Category.hasMany(Product, { as: 'products', foreignKey: 'category_id' });

  // ==================== Brand ====================
  Brand.hasMany(Product, { as: 'products', foreignKey: 'brand_id' });

  // ==================== Product ====================
  Product.belongsTo(Category, { as: 'category', foreignKey: 'category_id' });
  Product.belongsTo(Brand, { as: 'brand', foreignKey: 'brand_id' });
  Product.hasMany(ProductVariant, {
    as: 'variants',
    foreignKey: 'product_id',
    onDelete: 'CASCADE',
  });
  Product.hasMany(ProductImage, {
    as: 'images',
    foreignKey: 'product_id',
    onDelete: 'CASCADE',
  });

  // ==================== ProductVariant ====================
  ProductVariant.belongsTo(Product, {
    as: 'product',
    foreignKey: 'product_id',
  });
  ProductVariant.hasMany(CartItem, {
    as: 'cart_items',
    foreignKey: 'variant_id',
  });

  // ==================== ProductImage ====================
  ProductImage.belongsTo(Product, { as: 'product', foreignKey: 'product_id' });

  // ==================== Cart ====================
  Cart.belongsTo(User, { as: 'user', foreignKey: 'user_id' });
  Cart.hasMany(CartItem, {
    as: 'items',
    foreignKey: 'cart_id',
    onDelete: 'CASCADE',
  });

  // ==================== CartItem ====================
  CartItem.belongsTo(Cart, { as: 'cart', foreignKey: 'cart_id' });
  CartItem.belongsTo(ProductVariant, {
    as: 'variant',
    foreignKey: 'variant_id',
  });
}
