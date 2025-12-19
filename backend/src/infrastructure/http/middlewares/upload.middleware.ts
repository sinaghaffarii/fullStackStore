import type { NextFunction, Request, Response } from 'express';

import fs from 'fs';
import { StatusCodes } from 'http-status-codes';
import multer, { MulterError } from 'multer';
import path from 'path';

/* =======================
   Config
======================= */
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp'];

/* =======================
   Utils
======================= */
function ensureDirectoryExists(dir: string) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

/* =======================
   Storage
======================= */
const UPLOAD_ROOT = path.join(
  process.cwd(),
  'src/infrastructure/storage/uploads/images',
);

ensureDirectoryExists(UPLOAD_ROOT);

const storage = multer.diskStorage({
  destination(_req, _file, cb) {
    cb(null, UPLOAD_ROOT);
  },

  filename(_req, file, cb) {
    const now = new Date();
    const timestamp = now.toISOString().replace(/[.:]/g, '-');
    const random = Math.random().toString(36).slice(2, 8);
    const ext = path.extname(file.originalname).toLowerCase();

    cb(null, `${timestamp}-${random}${ext}`);
  },
});

/* =======================
   File Filter
======================= */
const fileFilter = (
  _req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback,
) => {
  if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    return cb(
      new Error(
        'فرمت فایل مجاز نیست. فقط jpg، jpeg، png و webp قابل قبول است.',
      ),
    );
  }

  const ext = path.extname(file.originalname).toLowerCase();
  if (!ALLOWED_EXTENSIONS.includes(ext)) {
    return cb(
      new Error('پسوند فایل مجاز نیست. فقط jpg، jpeg، png و webp مجاز است.'),
    );
  }

  cb(null, true);
};

/* =======================
   Multer Middleware
======================= */
const upload = multer({
  storage,
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter,
});

export const uploadSingleImage = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  upload.single('file')(req, res, (err?: unknown) => {
    if (!err) return next();

    if (err instanceof MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(StatusCodes.REQUEST_HEADER_FIELDS_TOO_LARGE).json({
          success: false,
          message: 'حجم فایل بیشتر از حد مجاز (۵ مگابایت) است.',
          error: { code: err.code },
        });
      }

      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'خطا در آپلود فایل.',
        error: { code: err.code },
      });
    }

    if (err instanceof Error) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: err.message,
        error: { code: 'INVALID_FILE' },
      });
    }

    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'خطای ناشناخته‌ای در آپلود فایل رخ داد.',
      error: { code: 'UPLOAD_ERROR' },
    });
  });
};
