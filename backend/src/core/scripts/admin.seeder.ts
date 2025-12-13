import bcrypt from 'bcrypt';

import { User } from '../../infrastructure/database/models';

interface AdminConfig {
  username: string;
  email: string;
  password: string;
}

export async function seedAdmin(config?: AdminConfig): Promise<void> {
  const adminConfig: AdminConfig = config || {
    username: process.env.ADMIN_USERNAME || 'admin',
    email: process.env.ADMIN_EMAIL || 'admin@example.com',
    password: process.env.ADMIN_PASSWORD || 'Admin@123456',
  };

  try {
    const existingAdmin = await User.findOne({
      where: { username: adminConfig.username },
    });

    if (existingAdmin) {
      console.log('✅ Admin already exists:', adminConfig.username);
      return;
    }

    const hashedPassword = await bcrypt.hash(adminConfig.password, 12);

    const admin = await User.create({
      username: adminConfig.username,
      email: adminConfig.email,
      password: hashedPassword,
      role: 'admin',
      is_verified: true,
    });

    console.log('✅ Admin created successfully');
    console.log(`   ID: ${admin.id}`);
    console.log(`   Username: ${admin.username}`);
    console.log(`   Email: ${admin.email}`);
    console.log('');
    console.log('⚠️  مهم: رمز عبور پیش‌فرض را تغییر دهید!');
  } catch (error) {
    console.error('❌ Error creating admin:', error);
  }
}
