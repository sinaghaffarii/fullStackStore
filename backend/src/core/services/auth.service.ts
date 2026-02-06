import bcrypt from 'bcrypt';
import { StatusCodes } from 'http-status-codes';
import { Op } from 'sequelize';

import type { SmsService } from '../../infrastructure/external/sms.service';

import { OTP, User } from '../../infrastructure/database/models';
import { AppError } from '../../shared/errors/app-error';
import { Role } from '../../shared/types-enums/role.enum';
import { tokenService } from './token.service';

interface GetAdminListQuery {
  page?: number;
  limit?: number;
  search?: string;
  isActive?: boolean;
}

interface AdminListResponse {
  items: User[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export class AuthService {
  private get maxOtpAttempts(): number {
    return 3;
  }

  private get otpCooldownSeconds(): number {
    return 60;
  }

  private get otpTtlSeconds(): number {
    return 120;
  }

  constructor(private smsService: SmsService) {}

  async adminLogin(username: string, password: string): Promise<User> {
    const user = await User.findOne({
      where: {
        username,
        role: [Role.Admin, Role.SuperAdmin], // هم Admin و هم SuperAdmin
      },
    });

    if (!user) {
      throw new AppError('نام کاربری یا رمز عبور اشتباه است', {
        statusCode: StatusCodes.UNAUTHORIZED,
      });
    }

    if (!user.is_active) {
      throw new AppError('حساب کاربری غیرفعال است', {
        statusCode: StatusCodes.FORBIDDEN,
      });
    }

    if (!user.password) {
      throw new AppError('حساب کاربری معتبر نیست', {
        statusCode: StatusCodes.UNAUTHORIZED,
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new AppError('نام کاربری یا رمز عبور اشتباه است', {
        statusCode: StatusCodes.UNAUTHORIZED,
      });
    }

    return user;
  }

  async createAdmin(
    data: {
      username: string;
      email: string;
      password: string;
    },
    creatorRole: Role,
  ): Promise<User> {
    if (creatorRole !== Role.SuperAdmin) {
      throw new AppError('شما مجوز کافی برای این عملیات را ندارید', {
        statusCode: StatusCodes.FORBIDDEN,
      });
    }

    const existingUser = await User.findOne({
      where: { username: data.username },
    });

    if (existingUser) {
      throw new AppError('نام کاربری قبلاً استفاده شده است', {
        statusCode: StatusCodes.CONFLICT,
      });
    }

    if (data.email) {
      const existingEmail = await User.findOne({
        where: { email: data.email },
      });

      if (existingEmail) {
        throw new AppError('ایمیل قبلاً استفاده شده است', {
          statusCode: StatusCodes.CONFLICT,
        });
      }
    }

    const hashedPassword = await bcrypt.hash(data.password, 12);

    const admin = await User.create({
      username: data.username,
      email: data.email,
      password: hashedPassword,
      role: Role.Admin,
      is_active: true,
      is_verified: true,
    });

    return admin;
  }

  async getAdminById(userId: string): Promise<User | null> {
    return User.findOne({
      where: {
        id: userId,
        role: [Role.Admin, Role.SuperAdmin],
      },
      attributes: [
        'id',
        'username',
        'email',
        'role',
        'is_active',
        'created_at',
        'updated_at',
      ],
    });
  }

  async getAdminList(
    requesterId: string,
    query: GetAdminListQuery,
  ): Promise<AdminListResponse> {
    const requester = await User.findByPk(requesterId);

    if (!requester?.isSuperAdmin()) {
      throw new AppError('شما مجوز کافی برای این عملیات را ندارید', {
        statusCode: StatusCodes.FORBIDDEN,
      });
    }

    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 50;
    const { search, isActive } = query;

    const where: any = {
      role: [Role.Admin, Role.SuperAdmin],
    };

    if (typeof isActive !== 'undefined') {
      where.is_active = isActive;
    }

    if (search) {
      where[Op.or] = [
        { username: { [Op.iLike]: `%${search}%` } },
        { email: { [Op.iLike]: `%${search}%` } },
      ];
    }

    const { rows, count } = await User.findAndCountAll({
      where,
      attributes: [
        'id',
        'username',
        'email',
        'role',
        'is_active',
        'created_at',
        'updated_at',
      ],
      limit,
      offset: (page - 1) * limit,
      order: [['created_at', 'DESC']],
    });

    const totalPages = Math.ceil(count / limit);

    return {
      items: rows,
      pagination: {
        total: count,
        page,
        limit,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    };
  }

  async getUserById(userId: string): Promise<User | null> {
    return User.findByPk(userId, {
      attributes: [
        'id',
        'username',
        'email',
        'phone_number',
        'role',
        'is_verified',
        'is_active',
        'created_at',
      ],
    });
  }

  async sendOtp(rawPhone: string): Promise<void> {
    const phone = this.normalizePhone(rawPhone);

    const existingOtp = await OTP.findActiveByPhone(phone);
    if (existingOtp && !existingOtp.canResend(this.otpCooldownSeconds)) {
      const waitTime = existingOtp.getResendWaitTime(this.otpCooldownSeconds);
      throw new AppError(`لطفاً ${waitTime} ثانیه صبر کنید`, {
        statusCode: StatusCodes.TOO_MANY_REQUESTS,
      });
    }

    await OTP.deleteByPhone(phone);

    const result = await this.smsService.sendOtp(phone);

    if (!result.success || !result.code) {
      throw new AppError(result.message || 'خطا در ارسال پیامک', {
        statusCode: StatusCodes.SERVICE_UNAVAILABLE,
      });
    }

    await OTP.create({
      phone_number: phone,
      code: result.code,
      attempts: 0,
      used: false,
      expires_at: new Date(Date.now() + this.otpTtlSeconds * 1000),
    });
  }

  async toggleAdminStatus(adminId: string, updaterRole: Role): Promise<User> {
    if (updaterRole !== Role.SuperAdmin) {
      throw new AppError('شما مجوز کافی برای این عملیات را ندارید', {
        statusCode: StatusCodes.FORBIDDEN,
      });
    }

    const admin = await User.findByPk(adminId);

    if (!admin) {
      throw new AppError('ادمین یافت نشد', {
        statusCode: StatusCodes.NOT_FOUND,
      });
    }

    if (admin.isSuperAdmin()) {
      throw new AppError('نمی‌توانید وضعیت SuperAdmin را تغییر دهید', {
        statusCode: StatusCodes.FORBIDDEN,
      });
    }

    // تغییر وضعیت (toggle)
    const newStatus = !admin.is_active;
    admin.is_active = newStatus;
    await admin.save();

    // اگر غیرفعال شد، همه توکن‌ها را ابطال کن
    if (!newStatus) {
      await tokenService.revokeAllUserTokens(admin.id);
    }

    return admin;
  }

  async updateAdmin(
    adminId: string,
    data: {
      email?: string;
      is_active?: boolean;
    },
    updaterRole: Role,
  ): Promise<User> {
    if (updaterRole !== Role.SuperAdmin) {
      throw new AppError('شما مجوز کافی برای این عملیات را ندارید', {
        statusCode: StatusCodes.FORBIDDEN,
      });
    }

    const admin = await User.findByPk(adminId);

    if (!admin) {
      throw new AppError('ادمین یافت نشد', {
        statusCode: StatusCodes.NOT_FOUND,
      });
    }

    if (admin.isSuperAdmin()) {
      throw new AppError('نمی‌توانید SuperAdmin را ویرایش کنید', {
        statusCode: StatusCodes.FORBIDDEN,
      });
    }

    if (data.email !== undefined) admin.email = data.email;
    if (data.is_active !== undefined) admin.is_active = data.is_active;

    await admin.save();

    return admin;
  }

  async verifyOtp(
    rawPhone: string,
    code: string,
  ): Promise<{ user: User; isNewUser: boolean }> {
    const phone = this.normalizePhone(rawPhone);

    const otp = await OTP.findActiveByPhone(phone);

    if (!otp) {
      throw new AppError(
        'کد تأیید یافت نشد یا منقضی شده. لطفاً دوباره درخواست دهید',
        { statusCode: StatusCodes.BAD_REQUEST },
      );
    }

    if (otp.isExpired()) {
      await otp.destroy();
      throw new AppError('کد تأیید منقضی شده است', {
        statusCode: StatusCodes.BAD_REQUEST,
      });
    }

    if (!otp.canAttempt(this.maxOtpAttempts)) {
      await otp.destroy();
      throw new AppError(
        'تعداد تلاش بیش از حد مجاز. لطفاً کد جدید دریافت کنید',
        { statusCode: StatusCodes.TOO_MANY_REQUESTS },
      );
    }

    if (otp.code !== code) {
      otp.attempts += 1;
      await otp.save();

      const remaining = this.maxOtpAttempts - otp.attempts;

      if (remaining <= 0) {
        await otp.destroy();
        throw new AppError('کد اشتباه است. لطفاً کد جدید دریافت کنید', {
          statusCode: StatusCodes.BAD_REQUEST,
        });
      }

      throw new AppError(`کد اشتباه است. ${remaining} تلاش باقی مانده`, {
        statusCode: StatusCodes.BAD_REQUEST,
      });
    }

    otp.used = true;
    await otp.save();

    const [user, created] = await User.findOrCreate({
      where: { phone_number: phone },
      defaults: {
        phone_number: phone,
        role: Role.Customer,
        is_active: true,
        is_verified: true,
      },
    });

    if (!created && !user.is_verified) {
      user.is_verified = true;
      await user.save();
    }

    return { user, isNewUser: created };
  }

  private normalizePhone(phone: string): string {
    let p = phone.replace(/\D/g, '');

    if (p.startsWith('98')) {
      p = `0${p.slice(2)}`;
    } else if (p.startsWith('9') && p.length === 10) {
      p = `0${p}`;
    }

    if (!/^09\d{9}$/.test(p)) {
      throw new AppError('شماره موبایل نامعتبر است', {
        statusCode: StatusCodes.BAD_REQUEST,
      });
    }

    return p;
  }
}
