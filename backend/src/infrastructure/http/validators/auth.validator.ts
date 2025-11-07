import Joi from 'joi';

export const authValidation = {
  sendOTP: Joi.object({
    email: Joi.string().email().required().messages({
      'string.email': 'Please provide a valid email address',
      'any.required': 'Email is required',
    }),
  }),

  verifyOTP: Joi.object({
    email: Joi.string().email().required(),
    code: Joi.string().length(6).pattern(/^\d+$/).required().messages({
      'string.length': 'OTP must be 6 digits',
      'string.pattern.base': 'OTP must contain only numbers',
    }),
  }),

  changePassword: Joi.object({
    currentPassword: Joi.string().min(6).required().messages({
      'string.min': 'Password must be at least 6 characters long',
    }),
    newPassword: Joi.string().min(6).required().messages({
      'string.min': 'New password must be at least 6 characters long',
    }),
  }),

  requestPasswordReset: Joi.object({
    email: Joi.string().email().required().messages({
      'string.email': 'Please provide a valid email address',
      'any.required': 'Email is required',
    }),
  }),

  verifyPasswordReset: Joi.object({
    email: Joi.string().email().required(),
    code: Joi.string().length(6).pattern(/^\d+$/).required().messages({
      'string.length': 'OTP must be 6 digits',
      'string.pattern.base': 'OTP must contain only numbers',
    }),
  }),

  resetPassword: Joi.object({
    resetToken: Joi.string().required().messages({
      'any.required': 'Reset token is required',
    }),
    newPassword: Joi.string().min(6).required().messages({
      'string.min': 'New password must be at least 6 characters long',
    }),
  }),

  updateProfile: Joi.object({
    email: Joi.string().email().optional().messages({
      'string.email': 'Please provide a valid email address',
    }),
  }),
};
