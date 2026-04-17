import { v2 as cloudinary } from 'cloudinary';
import { Readable, Writable } from 'stream';
import {
  IFileProvider,
  ProviderUploadFileDTO,
  ProviderDeleteFileDTO,
  ProviderGetFileDTO,
  ProviderFileResultDTO,
  ProviderUploadStreamDTO,
} from '@medusajs/framework/types';

type CloudinaryOptions = {
  cloud_name: string;
  api_key: string;
  api_secret: string;
  folder?: string;
};

export class CloudinaryFileService implements IFileProvider {
  protected options_: CloudinaryOptions;

  constructor({ }, options: CloudinaryOptions) {
    this.options_ = options;
    cloudinary.config({
      cloud_name: options.cloud_name,
      api_key: options.api_key,
      api_secret: options.api_secret,
    });
  }

  async upload(file: ProviderUploadFileDTO): Promise<ProviderFileResultDTO> {
    const folder = this.options_.folder || 'tavilgaa-medusa';
    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder, resource_type: 'auto' },
        (error, result) => {
          if (error || !result) return reject(error);
          resolve({ url: result.secure_url, key: result.public_id });
        }
      );
      const buffer = Buffer.isBuffer(file.content)
        ? file.content
        : Buffer.from(file.content as any);
      stream.end(buffer);
    });
  }

  async delete(fileData: ProviderDeleteFileDTO): Promise<void> {
    await cloudinary.uploader.destroy(fileData.fileKey);
  }

  async getPresignedDownloadUrl(fileData: ProviderGetFileDTO): Promise<string> {
    return cloudinary.url(fileData.fileKey, { secure: true });
  }

  async getDownloadStream(fileData: ProviderGetFileDTO): Promise<Readable> {
    const url = cloudinary.url(fileData.fileKey, { secure: true });
    const response = await fetch(url);
    const buffer = await response.arrayBuffer();
    const readable = new Readable();
    readable.push(Buffer.from(buffer));
    readable.push(null);
    return readable;
  }

  async getAsBuffer(fileData: ProviderGetFileDTO): Promise<Buffer> {
    const url = cloudinary.url(fileData.fileKey, { secure: true });
    const response = await fetch(url);
    return Buffer.from(await response.arrayBuffer());
  }

  async getUploadStream(fileData: ProviderUploadStreamDTO): Promise<{
    writeStream: Writable;
    promise: Promise<ProviderFileResultDTO>;
    url: string;
    fileKey: string;
  }> {
    const folder = this.options_.folder || 'tavilgaa-medusa';
    let resolveUpload: (val: ProviderFileResultDTO) => void;
    const promise = new Promise<ProviderFileResultDTO>(
      (resolve) => { resolveUpload = resolve; }
    );
    const writeStream = cloudinary.uploader.upload_stream(
      { folder, resource_type: 'auto' },
      (_, result) => {
        if (result) resolveUpload({ url: result.secure_url, key: result.public_id });
      }
    );
    const publicId = `${folder}/${fileData.filename}`;
    const url = cloudinary.url(publicId, { secure: true });
    return { writeStream, promise, fileKey: publicId, url };
  }
}

export default CloudinaryFileService;

export const services = [CloudinaryFileService];
