export interface IMailAttachment {
  filename: string;
  content: Buffer;
  contentType?: string;
}

export interface IMailMessage {
  to: string;
  subject: string;
  body: string;
  attachments?: IMailAttachment[];
}

export interface IMailProvider {
  sendMail(message: IMailMessage): Promise<void>;
}
