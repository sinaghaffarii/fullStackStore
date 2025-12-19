import type { Request, Response } from 'express';

import { StatusCodes } from 'http-status-codes';

import { UploadService } from '../../../core/services/upload.service';

const uploadService = new UploadService();

export class UploadController {
  uploadImage = async (req: Request, res: Response) => {
    const url = await uploadService.handleSingleUpload(req.file);

    res.status(StatusCodes.CREATED).json({
      success: true,
      data: { url },
    });
  };
}
