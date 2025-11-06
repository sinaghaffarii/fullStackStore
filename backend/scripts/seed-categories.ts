import { sequelize } from '../src/configs/database';
import { Category } from '../src/infrastructure/database/models/category.model';

async function seedCategories() {
  try {
    await sequelize.authenticate();
    console.log('Connected to database');

    // Create sample categories
    const categories = [
      {
        name: 'آرایشی و بهداشتی',
        description: 'محصولات آرایشی و بهداشتی',
      },
      {
        name: 'پوشاک',
        description: 'لباس و پوشاک',
      },
      {
        name: 'غذا',
        description: 'مواد غذایی',
      },
      {
        name: 'الکترونیک',
        description: 'کالاهای الکترونیکی',
      },
    ];

    for (const categoryData of categories) {
      await Category.findOrCreate({
        where: { name: categoryData.name },
        defaults: categoryData,
      });
    }

    console.log('✅ Categories seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding categories:', error);
    process.exit(1);
  }
}

seedCategories();
