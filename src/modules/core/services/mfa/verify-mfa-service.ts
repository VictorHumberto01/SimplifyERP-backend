import { inject, injectable } from "tsyringe";
import { authenticator } from "otplib";
import { TokenType } from "@/core/enums/token-type";
import { UnauthorizedError } from "@/core/errors/unauthorized-error";
import { DomainEvents } from "@/core/events/domain-events";
import { IVerifyMfaDto } from "../../dtos/auth.dto";
import { Account } from "../../entities/account";
import { AccountLoggedInEvent } from "../../events/account-logged-in.event";
import { MfaSecretCipher } from "../../cryptography/mfa-secret-cipher";
import { GetAccountByIdUseCase } from "../../use-cases/account/get-account-by-id.use-case";
import { GenerateTokenUseCase } from "../../use-cases/token/generate-token.use-case";
import { VerifyTokenUseCase } from "../../use-cases/token/verify-token.use-case";
import { CreateSessionUseCase } from "../../use-cases/session/create-session.use-case";

interface IVerifyMfaResult {
  account: Account;
  accessToken: string;
  refreshToken: string;
}

@injectable()
export class VerifyMfaService {
  constructor(
    @inject(VerifyTokenUseCase) private readonly verifyTokenUseCase: VerifyTokenUseCase,
    @inject(GetAccountByIdUseCase) private readonly getAccountByIdUseCase: GetAccountByIdUseCase,
    @inject(GenerateTokenUseCase) private readonly generateTokenUseCase: GenerateTokenUseCase,
    @inject(CreateSessionUseCase) private readonly createSessionUseCase: CreateSessionUseCase,
  ) {}

  async execute({ mfaChallengeToken, code, userAgent, ip }: IVerifyMfaDto): Promise<IVerifyMfaResult> {
    const { userId, type } = await this.verifyTokenUseCase.execute({ token: mfaChallengeToken });

    if (type !== TokenType.MFA_CHALLENGE) {
      throw new UnauthorizedError("Token de desafio MFA inválido.");
    }

    const { account } = await this.getAccountByIdUseCase.execute({ accountId: userId });

    if (!account.mfaEnabled || !account.mfaSecretCipher) {
      throw new UnauthorizedError("MFA não está habilitado para esta conta.");
    }

    const secret = MfaSecretCipher.decrypt(account.mfaSecretCipher);
    const isValid = authenticator.verify({ token: code, secret });

    if (!isValid) {
      throw new UnauthorizedError("Código MFA inválido ou expirado.");
    }

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

    await this.createSessionUseCase.execute({ accountId: account.id, refreshToken, expiresAt, userAgent, ip });

    DomainEvents.dispatchImmediate(new AccountLoggedInEvent(account.id, account.email.value));

    return { account, accessToken, refreshToken };
  }
}
