import { sequelize } from '../../configs/database';
import { Category } from '../../infrastructure/database/models';

function toSlug(value: string): string {
  return value
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '');
}

async function seedCategories() {
  try {
    await sequelize.authenticate();
    console.log('Connected to database');

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

    await Promise.all(
      categories.map((category) =>
        Category.findOrCreate({
          where: { name: category.name },
          defaults: {
            ...category,
            slug: toSlug(category.name),
          } as any,
        }),
      ),
    );

    console.log('✅ Categories seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding categories:', error);
    process.exit(1);
  }
}

seedCategories();
