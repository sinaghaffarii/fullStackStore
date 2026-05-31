import type { NextFunction, Request, Response } from 'express';

import { StatusCodes } from 'http-status-codes';

import { AppError } from '../shared/errors/app-error';
import { Role } from '../shared/types-enums/role.enum';

// ==================== Main Role Middleware ====================

export const requireRole = (...allowedRoles: Role[]) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      throw new AppError('احراز هویت نشده', {
        statusCode: StatusCodes.UNAUTHORIZED,
      });
    }

    if (!allowedRoles.includes(req.user.role as Role)) {
      throw new AppError('شما دسترسی به این بخش را ندارید', {
        statusCode: StatusCodes.FORBIDDEN,
      });
    }

    next();
  };
};

// ==================== Predefined Middlewares ====================

// فقط SuperAdmin
export const requireSuperAdmin = requireRole(Role.SuperAdmin);

// Admin یا SuperAdmin (دسترسی به داشبورد)
export const requireAdmin = requireRole(Role.Admin, Role.SuperAdmin);

// فقط Customer
export const requireCustomer = requireRole(Role.Customer);

// هر کاربر احراز هویت شده (Admin، SuperAdmin، Customer)
export const requireAnyAuth = requireRole(
  Role.Admin,
  Role.SuperAdmin,
  Role.Customer,
);

// ==================== Dynamic Middleware ====================

// برای زمانی که می‌خواهید دینامیک نقش‌ها را تعریف کنید
export const roleMiddleware = (roles: Role[]) => requireRole(...roles);
