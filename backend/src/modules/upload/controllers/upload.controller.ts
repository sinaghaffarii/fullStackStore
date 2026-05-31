import type { Request, Response } from 'express';

import { StatusCodes } from 'http-status-codes';

import { UploadService } from '../services/upload.service';

const uploadService = new UploadService();

export class UploadController {
  uploadImage = async (req: Request, res: Response) => {
    const url = await uploadService.handleSingleUpload(req.file);

    res.status(StatusCodes.CREATED).json({
      status: true,
      data: { url },
    });
  };
}
