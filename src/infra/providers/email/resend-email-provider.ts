import { logger } from "@/core/logger";
import { IMailMessage, IMailProvider } from "@/core/mail/mail-provider";
import env from "@/infra/env";
import { Resend } from "resend";
import { injectable } from "tsyringe";

@injectable()
export class ResendEmailProvider implements IMailProvider {
  async sendMail(message: IMailMessage): Promise<void> {
    if (!env.resend.apiKey) {
      logger.warn("Resend não configurado; e-mail não enviado");
      return;
    }

    const { error } = await new Resend(env.resend.apiKey).emails.send({
      from: env.resend.fromEmail,
      to: [message.to],
      subject: message.subject,
      html: message.body,
      attachments: message.attachments?.map((attachment) => ({
        filename: attachment.filename,
        content: attachment.content.toString("base64"),
      })),
    });

    if (error) throw error;
    logger.info({ recipient: message.to }, "E-mail enviado");
  }
}
