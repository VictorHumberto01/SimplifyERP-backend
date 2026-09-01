import { IFileStorage, IUploadFileRequest } from "@/core/storage/file-storage";

export class InMemoryFileStorage implements IFileStorage {
  files = new Map<string, { content: Buffer; contentType: string }>();

  async upload({ key, content, contentType }: IUploadFileRequest): Promise<void> {
    this.files.set(key, { content, contentType });
  }

  async getDownloadUrl(key: string, expiresInSeconds = 900): Promise<string> {
    if (!this.files.has(key)) {
      throw new Error(`Arquivo não encontrado: ${key}`);
    }
    return `memory://${key}?expiresIn=${expiresInSeconds}`;
  }

  async delete(key: string): Promise<void> {
    this.files.delete(key);
  }
}
