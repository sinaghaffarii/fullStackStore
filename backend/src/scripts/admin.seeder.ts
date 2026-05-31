import bcrypt from 'bcrypt';

import User from '../modules/user/models/user.model';
import { Role } from '../shared/types-enums/role.enum';

interface AdminConfig {
  username: string;
  email: string;
  password: string;
}

export async function seedAdmin(config?: AdminConfig): Promise<void> {
  const adminConfig: AdminConfig = config || {
    username: process.env.ADMIN_USERNAME || 'superadmin',
    email: process.env.ADMIN_EMAIL || 'superadmin@example.com',
    password: process.env.ADMIN_PASSWORD || 'SuperAdmin@123456',
  };

  try {
    const existingAdmin = await User.findOne({
      where: { username: adminConfig.username },
    });

    if (existingAdmin) {
      console.log('✅ Super Admin already exists:', adminConfig.username);
      return;
    }

    const hashedPassword = await bcrypt.hash(adminConfig.password, 12);

    const admin = await User.create({
      username: adminConfig.username,
      email: adminConfig.email,
      password: hashedPassword,
      role: Role.SuperAdmin,
      is_active: true,
      is_verified: true,
    });

    console.log('✅ Super Admin created successfully');
    console.log(`   ID: ${admin.id}`);
    console.log(`   Username: ${admin.username}`);
    console.log(`   Email: ${admin.email}`);
    console.log(`   Role: ${admin.role}`);
    console.log('');
    console.log('⚠️  IMPORTANT: Change the default password immediately!');
  } catch (error) {
    console.error('❌ Error creating super admin:', error);
  }
}
