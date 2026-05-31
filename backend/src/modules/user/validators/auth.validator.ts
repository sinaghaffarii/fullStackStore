import Joi from 'joi';

const phoneRegex = /^09\d{9}$/;

export const authValidation = {
  // ==================== OTP ====================

  sendOtp: Joi.object({
    phoneNumber: Joi.string().pattern(phoneRegex).required().messages({
      'string.pattern.base': 'شماره موبایل باید با 09 شروع شود و 11 رقم باشد',
      'string.empty': 'شماره موبایل نمی‌تواند خالی باشد',
      'any.required': 'شماره موبایل الزامی است',
    }),
  }),

  verifyOtp: Joi.object({
    phoneNumber: Joi.string().pattern(phoneRegex).required().messages({
      'string.pattern.base': 'شماره موبایل نامعتبر است',
      'any.required': 'شماره موبایل الزامی است',
    }),
    code: Joi.string().length(5).pattern(/^\d+$/).required().messages({
      'string.length': 'کد تأیید باید 5 رقم باشد',
      'string.pattern.base': 'کد تأیید فقط باید شامل اعداد باشد',
      'any.required': 'کد تأیید الزامی است',
    }),
  }),

  // ==================== Admin Login ====================

  adminLogin: Joi.object({
    username: Joi.string().min(3).max(50).required().messages({
      'string.min': 'نام کاربری باید حداقل 3 کاراکتر باشد',
      'string.max': 'نام کاربری نمی‌تواند بیش از 50 کاراکتر باشد',
      'any.required': 'نام کاربری الزامی است',
    }),
    password: Joi.string().min(6).required().messages({
      'string.min': 'رمز عبور باید حداقل 6 کاراکتر باشد',
      'any.required': 'رمز عبور الزامی است',
    }),
  }),

  // ==================== Admin Management ====================

  createAdmin: Joi.object({
    username: Joi.string().min(3).max(50).required().messages({
      'string.min': 'نام کاربری باید حداقل 3 کاراکتر باشد',
      'string.max': 'نام کاربری نمی‌تواند بیش از 50 کاراکتر باشد',
      'any.required': 'نام کاربری الزامی است',
    }),
    email: Joi.string().email().required().messages({
      'string.email': 'ایمیل نامعتبر است',
      'any.required': 'ایمیل الزامی است',
    }),
    password: Joi.string()
      .min(8)
      .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!$%&*?@])[\d!$%&*?-Za-z]/)
      .required()
      .messages({
        'string.min': 'رمز عبور باید حداقل 8 کاراکتر باشد',
        'string.pattern.base':
          'رمز عبور باید شامل حروف بزرگ، کوچک، عدد و کاراکتر خاص باشد',
        'any.required': 'رمز عبور الزامی است',
      }),
  }),

  updateAdmin: Joi.object({
    email: Joi.string().email().optional().messages({
      'string.email': 'ایمیل نامعتبر است',
    }),
    isActive: Joi.boolean().optional(),
  }).min(1),

  adminId: Joi.object({
    adminId: Joi.string().uuid().required().messages({
      'string.guid': 'شناسه ادمین نامعتبر است',
      'any.required': 'شناسه ادمین الزامی است',
    }),
  }),

  // ==================== Token Management ====================

  refreshToken: Joi.object({
    refreshToken: Joi.string().optional(),
  }),

  sessionId: Joi.object({
    sessionId: Joi.string().uuid().required().messages({
      'string.guid': 'شناسه نشست نامعتبر است',
      'any.required': 'شناسه نشست الزامی است',
    }),
  }),

  // ==================== Password Reset ====================

  requestPasswordReset: Joi.object({
    phoneNumber: Joi.string().pattern(phoneRegex).messages({
      'string.pattern.base': 'شماره موبایل نامعتبر است',
    }),
    email: Joi.string().email().messages({
      'string.email': 'ایمیل نامعتبر است',
    }),
  })
    .or('phoneNumber', 'email')
    .messages({
      'object.missing': 'شماره موبایل یا ایمیل الزامی است',
    }),

  verifyPasswordReset: Joi.object({
    phoneNumber: Joi.string().pattern(phoneRegex),
    email: Joi.string().email(),
    code: Joi.string().length(5).pattern(/^\d+$/).required().messages({
      'string.length': 'کد تأیید باید 5 رقم باشد',
      'any.required': 'کد تأیید الزامی است',
    }),
  }).or('phoneNumber', 'email'),

  resetPassword: Joi.object({
    phoneNumber: Joi.string().pattern(phoneRegex),
    email: Joi.string().email(),
    code: Joi.string().length(5).pattern(/^\d+$/).required(),
    newPassword: Joi.string().min(6).required().messages({
      'string.min': 'رمز عبور باید حداقل 6 کاراکتر باشد',
      'any.required': 'رمز عبور جدید الزامی است',
    }),
  }).or('phoneNumber', 'email'),

  // ==================== Profile Management ====================

  updateProfile: Joi.object({
    username: Joi.string().min(3).max(50).messages({
      'string.min': 'نام کاربری باید حداقل 3 کاراکتر باشد',
      'string.max': 'نام کاربری نمی‌تواند بیش از 50 کاراکتر باشد',
    }),
    email: Joi.string().email().messages({
      'string.email': 'ایمیل نامعتبر است',
    }),
  }),

  changePassword: Joi.object({
    currentPassword: Joi.string().required().messages({
      'any.required': 'رمز عبور فعلی الزامی است',
    }),
    newPassword: Joi.string().min(6).required().messages({
      'string.min': 'رمز عبور جدید باید حداقل 6 کاراکتر باشد',
      'any.required': 'رمز عبور جدید الزامی است',
    }),
  }),
};
