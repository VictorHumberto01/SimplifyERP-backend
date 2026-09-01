import { inject, injectable } from "tsyringe";
import { IAccountRepository } from "../../repositories/account-repository";
import { Password } from "../../entities/value-objects/password";
import { IResetPasswordDto } from "../../dtos/auth.dto";
import { UnauthorizedError } from "@/core/errors/unauthorized-error";
import { BadRequestError } from "@/core/errors/bad-request.error";
import { DomainEvents } from "@/core/events/domain-events";
import { PasswordResetEvent } from "../../events/password-reset.event";
import { RevokeAllSessionsUseCase } from "../../use-cases/session/revoke-all-sessions.use-case";
import crypto from "crypto";

@injectable()
export class ResetPasswordService {
  constructor(
    @inject("accountRepository")
    private readonly accountRepository: IAccountRepository,
    @inject(RevokeAllSessionsUseCase)
    private readonly revokeAllSessionsUseCase: RevokeAllSessionsUseCase,
  ) {}

  async execute({ token, newPassword }: IResetPasswordDto): Promise<void> {
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const account =
      await this.accountRepository.getByPasswordResetToken(hashedToken);

    if (!account || !account.passwordResetExpiresAt) {
      throw new UnauthorizedError("Este link é inválido ou já foi utilizado.");
    }

    if (account.passwordResetExpiresAt.getTime() < new Date().getTime()) {
      throw new UnauthorizedError("Este link já expirou. Solicite um novo.");
    }

    // Password strength validation: min 8 chars, 1 uppercase, 1 number
    if (
      newPassword.length < 8 ||
      !/[A-Z]/.test(newPassword) ||
      !/[0-9]/.test(newPassword)
    ) {
      throw new BadRequestError(
        "A senha deve ter pelo menos 8 caracteres, uma letra maiúscula e um número.",
      );
    }

    const password = Password.createNewPassword(newPassword);
    account.changePassword(password);
    account.incrementPasswordResetVersion();
    account.clearPasswordResetToken();

    await this.accountRepository.save(account);
    await this.revokeAllSessionsUseCase.execute(account.id);

    DomainEvents.dispatchImmediate(new PasswordResetEvent(account.id));
  }
}
