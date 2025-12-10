import { Injectable } from '@nestjs/common';
import { UploadApiErrorResponse, UploadApiResponse, v2 as cloudinary } from 'cloudinary';
import toStream = require('buffer-to-stream');
import 'multer'

@Injectable()
export class CloudinaryService {
  async uploadImage(
    file: Express.Multer.File,
    pasta: string = 'MDS_Guardioes'
  ): Promise<UploadApiResponse | UploadApiErrorResponse> {
    
    return new Promise((resolve, reject) => {
      const upload = cloudinary.uploader.upload_stream(
        { 
          folder: pasta,
          resource_type: 'auto' 
        },
        (error, result) => {
          if (error) return reject(error);
          if (!result) {
             return reject(new Error('Ocorreu um erro ao fazer o upload: Resposta vazia.'));
          }

          resolve(result);
        },
      );

      toStream(file.buffer).pipe(upload);
    });
  }
}