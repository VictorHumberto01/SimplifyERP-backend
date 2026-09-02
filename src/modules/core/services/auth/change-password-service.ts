import { inject, injectable } from "tsyringe";
import { GetAccountByIdUseCase } from "../../use-cases/account/get-account-by-id.use-case";
import { IAccountRepository } from "../../repositories/account-repository";
import { Password } from "../../entities/value-objects/password";
import { IChangePasswordDto } from "../../dtos/auth.dto";
import { UnauthorizedError } from "@/core/errors/unauthorized-error";
import { BadRequestError } from "@/core/errors/bad-request.error";
import { DomainEvents } from "@/core/events/domain-events";
import { PasswordChangedEvent } from "../../events/password-changed.event";
import { RevokeAllSessionsUseCase } from "../../use-cases/session/revoke-all-sessions.use-case";

@injectable()
export class ChangePasswordService {
  constructor(
    @inject(GetAccountByIdUseCase)
    private readonly getAccountByIdUseCase: GetAccountByIdUseCase,
    @inject("accountRepository")
    private readonly accountRepository: IAccountRepository,
    @inject(RevokeAllSessionsUseCase)
    private readonly revokeAllSessionsUseCase: RevokeAllSessionsUseCase,
  ) {}

  async execute(
    accountId: string,
    { currentPassword, newPassword }: IChangePasswordDto,
  ): Promise<void> {
    const { account } = await this.getAccountByIdUseCase.execute({ accountId });

    if (!currentPassword) {
      throw new BadRequestError("Sua senha atual é necessária.");
    }

    const isPasswordValid =
      await account.password.comparePasswords(currentPassword);

    if (!isPasswordValid) {
      throw new UnauthorizedError("Sua senha atual está incorreta.");
    }

    // Password strength validation: min 8 chars, 1 uppercase, 1 number
    if (
      newPassword.length < 8 ||
      !/[A-Z]/.test(newPassword) ||
      !/[0-9]/.test(newPassword)
    ) {
      throw new BadRequestError(
        "A nova senha deve ter pelo menos 8 caracteres, uma letra maiúscula e um número.",
      );
    }

    const password = Password.createNewPassword(newPassword);
    account.changePassword(password);
    // Invalidate any outstanding password-reset tokens by bumping the version
    account.incrementPasswordResetVersion();

    await this.accountRepository.save(account);
    await this.revokeAllSessionsUseCase.execute(account.id);

    DomainEvents.dispatchImmediate(new PasswordChangedEvent(account.id));
  }
}
