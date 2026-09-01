import { logger } from "@/core/logger";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";
import { IMailProvider } from "@/core/mail/mail-provider";
import env from "@/infra/env";
import crypto from "crypto";
import { inject, injectable } from "tsyringe";
import { IForgotPasswordDto } from "../../dtos/auth.dto";
import { IAccountRepository } from "../../repositories/account-repository";
import { GetAccountByEmailUseCase } from "../../use-cases/account/get-account-by-email.use-case";

@injectable()
export class ForgotPasswordService {
  constructor(
    @inject(GetAccountByEmailUseCase)
    private readonly getAccountByEmailUseCase: GetAccountByEmailUseCase,
    @inject("accountRepository")
    private readonly accountRepository: IAccountRepository,
    @inject("mailProvider")
    private readonly mailProvider: IMailProvider,
  ) {}

  async execute({ email }: IForgotPasswordDto): Promise<void> {
    try {
      const { account } = await this.getAccountByEmailUseCase.execute({ email });
      if (account.deletedAt) return;

      const resetToken = crypto.randomBytes(32).toString("hex");
      const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");
      const expiresAt = new Date(Date.now() + env.passwordResetExpirationMinutes * 60_000);

      account.createPasswordResetToken(hashedToken, expiresAt);
      await this.accountRepository.save(account);

      const resetLink = `${env.frontendUrl}/reset-password?token=${resetToken}`;
      await this.mailProvider.sendMail({
        to: account.email.value,
        subject: "Recuperação de senha — SimplifyERP",
        body: `
          <h1>Recuperação de senha</h1>
          <p>Olá, ${account.name}.</p>
          <p>Recebemos uma solicitação para redefinir sua senha no SimplifyERP.</p>
          <p><a href="${resetLink}">Criar nova senha</a></p>
          <p>Este link é válido por ${env.passwordResetExpirationMinutes} minutos.</p>
          <p>Se você não solicitou essa alteração, ignore este e-mail.</p>
        `,
      });
    } catch (error) {
      if (error instanceof ResourceNotFoundError) return;
      logger.error(error, "Falha ao processar recuperação de senha");
      throw error;
    }
  }
}
