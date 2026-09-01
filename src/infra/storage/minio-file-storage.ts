import { Client as MinioClient } from "minio";
import { injectable } from "tsyringe";
import env from "@/infra/env";
import { IFileStorage, IUploadFileRequest } from "@/core/storage/file-storage";

const DEFAULT_DOWNLOAD_URL_EXPIRATION_SECONDS = 15 * 60;

@injectable()
export class MinioFileStorage implements IFileStorage {
  private client: MinioClient;
  private bucket: string;

  constructor() {
    this.client = new MinioClient({
      endPoint: env.minio.endpoint,
      port: env.minio.port,
      useSSL: env.minio.useSSL,
      accessKey: env.minio.accessKey,
      secretKey: env.minio.secretKey,
    });
    this.bucket = env.minio.bucket;
  }

  async upload({ key, content, contentType }: IUploadFileRequest): Promise<void> {
    await this.client.putObject(this.bucket, key, content, content.length, {
      "Content-Type": contentType,
    });
  }

  async getDownloadUrl(key: string, expiresInSeconds = DEFAULT_DOWNLOAD_URL_EXPIRATION_SECONDS): Promise<string> {
    return this.client.presignedGetObject(this.bucket, key, expiresInSeconds);
  }

  async delete(key: string): Promise<void> {
    await this.client.removeObject(this.bucket, key);
  }

  /**
   * Creates the bucket if it doesn't exist yet. Called once on app startup
   * (see infra/http/main.ts); failures are logged but never crash the app,
   * mirroring how Resend/Sentry are treated as optional infra.
   */
  async ensureBucket(): Promise<void> {
    const exists = await this.client.bucketExists(this.bucket).catch(() => false);
    if (!exists) {
      await this.client.makeBucket(this.bucket);
    }
  }
}
