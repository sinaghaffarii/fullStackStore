import fs from 'fs/promises';
import path from 'path';

const UPLOAD_ROOT = path.join(
  process.cwd(),
  'src/infrastructure/storage/uploads/images',
);

export class UploadService {
  async handleSingleUpload(file?: Express.Multer.File): Promise<string> {
    if (!file) {
      throw new Error('فایلی ارسال نشده است');
    }

    try {
      const relativePath = path
        .relative(UPLOAD_ROOT, file.path)
        .replace(/\\/g, '/');

      return `/images/${relativePath}`;
    } catch (error) {
      await fs.unlink(file.path).catch(() => undefined);
      throw error;
    }
  }
}
