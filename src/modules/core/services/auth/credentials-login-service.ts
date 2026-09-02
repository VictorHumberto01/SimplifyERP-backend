import { UnauthorizedError } from "@/core/errors/unauthorized-error";
import { GetAccountByEmailUseCase } from "../../use-cases/account/get-account-by-email.use-case";
import { GenerateTokenUseCase } from "../../use-cases/token/generate-token.use-case";
import { CreateSessionUseCase } from "../../use-cases/session/create-session.use-case";
import { TokenType } from "@/core/enums/token-type";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";
import { DomainEvents } from "@/core/events/domain-events";
import { inject, injectable } from "tsyringe";
import { ILoginWithEmailAndPasswordDto } from "../../dtos/auth.dto";
import { Account } from "../../entities/account";
import { AccountLoggedInEvent } from "../../events/account-logged-in.event";
import { AccountLoginFailedEvent } from "../../events/account-login-failed.event";

interface ICompletedLoginResult {
  mfaRequired: false;
  account: Account;
  accessToken: string;
  refreshToken: string;
}

interface IMfaChallengeResult {
  mfaRequired: true;
  mfaChallengeToken: string;
}

@injectable()
export class CredentialsLoginService {
  constructor(
    @inject(GetAccountByEmailUseCase)
    private readonly getAccountByEmailUseCase: GetAccountByEmailUseCase,
    @inject(GenerateTokenUseCase)
    private readonly generateTokenUseCase: GenerateTokenUseCase,
    @inject(CreateSessionUseCase)
    private readonly createSessionUseCase: CreateSessionUseCase,
  ) {}

  async login({
    email,
    password,
    userAgent,
    ip,
  }: ILoginWithEmailAndPasswordDto): Promise<ICompletedLoginResult | IMfaChallengeResult> {
    try {
      const { account } = await this.getAccountByEmailUseCase.execute({
        email,
      });

      if (account.deletedAt) {
        throw new UnauthorizedError(
          "Esta conta foi desativada. Por favor, entre em contato com o administrador.",
        );
      }

      const isPasswordValid = await account.password.comparePasswords(password);

      if (isPasswordValid === false) {
        throw new UnauthorizedError("E-mail ou senha inválidos.");
      }

      if (account.mfaEnabled) {
        const { token: mfaChallengeToken } = this.generateTokenUseCase.execute({
          userId: account.id,
          type: TokenType.MFA_CHALLENGE,
          version: account.passwordResetVersion,
        });

        return { mfaRequired: true, mfaChallengeToken };
      }

      const { accessToken, refreshToken } = await this.issueTokensAndSession(account, userAgent, ip);

      DomainEvents.dispatchImmediate(new AccountLoggedInEvent(account.id, account.email.value));

      return { mfaRequired: false, account, accessToken, refreshToken };
    } catch (error) {
      if (error instanceof ResourceNotFoundError) {
        DomainEvents.dispatchImmediate(new AccountLoginFailedEvent(email, "account_not_found"));
        throw new UnauthorizedError("E-mail ou senha inválidos.");
      }

      if (error instanceof UnauthorizedError) {
        DomainEvents.dispatchImmediate(new AccountLoginFailedEvent(email, error.message));
      }

      throw error;
    }
  }

  private async issueTokensAndSession(account: Account, userAgent?: string | null, ip?: string | null) {
    const { token: accessToken } = this.generateTokenUseCase.execute({
      userId: account.id,
      type: TokenType.ACCESS,
      version: account.passwordResetVersion,
    });

    const { token: refreshToken, expiresAt } = this.generateTokenUseCase.execute({
      userId: account.id,
      type: TokenType.REFRESH,
      version: account.passwordResetVersion,
    });

    await this.createSessionUseCase.execute({
      accountId: account.id,
      refreshToken,
      expiresAt,
      userAgent,
      ip,
    });

    return { accessToken, refreshToken };
  }
}
