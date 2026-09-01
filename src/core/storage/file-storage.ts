export interface IUploadFileRequest {
  key: string;
  content: Buffer;
  contentType: string;
}

export interface IFileStorage {
  upload(request: IUploadFileRequest): Promise<void>;
  getDownloadUrl(key: string, expiresInSeconds?: number): Promise<string>;
  delete(key: string): Promise<void>;
}
