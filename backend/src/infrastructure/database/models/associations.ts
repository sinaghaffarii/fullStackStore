import { Cart, CartItem } from './cart.model';
import { Category } from './category.model';
import { OTP } from './otp.model';
import { Product } from './product.model';
import { User } from './user.model';

export function setupAssociations(): void {
  console.log('🔄 Setting up database associations...');

  try {
    const models = {
      Category,
      Product,
      User,
      OTP,
      Cart,
      CartItem,
    };

    // Setup associations for each model
    Object.values(models).forEach((model) => {
      if (typeof model.associate === 'function') {
        model.associate(models);
      }
    });

    console.log('✅ Database associations setup completed');
  } catch (error) {
    console.error('❌ Error setting up associations:', error);
    throw error;
  }
}
