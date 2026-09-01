import { TokenType } from "@/core/enums/token-type";
import { UnauthorizedError } from "@/core/errors/unauthorized-error";
import { inject, injectable } from "tsyringe";
import { IRefreshAuthDto } from "../../dtos/auth.dto";
import { ISessionRepository } from "../../repositories/session-repository";
import { GetAccountByIdUseCase } from "../../use-cases/account/get-account-by-id.use-case";
import { GenerateTokenUseCase } from "../../use-cases/token/generate-token.use-case";
import { VerifyTokenUseCase } from "../../use-cases/token/verify-token.use-case";
import { CreateSessionUseCase } from "../../use-cases/session/create-session.use-case";
import { FindSessionByRefreshTokenUseCase } from "../../use-cases/session/find-session-by-refresh-token.use-case";
import { RevokeAllSessionsUseCase } from "../../use-cases/session/revoke-all-sessions.use-case";

@injectable()
export class RefreshAuthService {
  constructor(
    @inject(VerifyTokenUseCase) private readonly verifyTokenUseCase: VerifyTokenUseCase,
    @inject(GetAccountByIdUseCase) private readonly getAccountByIdUseCase: GetAccountByIdUseCase,
    @inject(GenerateTokenUseCase) private readonly generateTokenUseCase: GenerateTokenUseCase,
    @inject(CreateSessionUseCase) private readonly createSessionUseCase: CreateSessionUseCase,
    @inject(FindSessionByRefreshTokenUseCase)
    private readonly findSessionByRefreshTokenUseCase: FindSessionByRefreshTokenUseCase,
    @inject(RevokeAllSessionsUseCase) private readonly revokeAllSessionsUseCase: RevokeAllSessionsUseCase,
    @inject("sessionRepository") private readonly sessionRepository: ISessionRepository,
  ) {}

  async execute({ refreshToken, userAgent, ip }: IRefreshAuthDto) {
    const { userId, type, version } = await this.verifyTokenUseCase.execute({ token: refreshToken });
    if (type !== TokenType.REFRESH || version === undefined) {
      throw new UnauthorizedError("Token inválido");
    }

    const { account } = await this.getAccountByIdUseCase.execute({ accountId: userId });
    if (account.passwordResetVersion !== version) {
      throw new UnauthorizedError("Sessão expirada devido a troca de senha.");
    }

    const { session } = await this.findSessionByRefreshTokenUseCase.execute(refreshToken);

    if (!session) {
      // Refresh token is a valid JWT but has no matching session (e.g. issued before
      // this feature existed, or already garbage-collected). Treat as invalid.
      throw new UnauthorizedError("Sessão não encontrada. Faça login novamente.");
    }

    if (session.revokedAt !== null) {
      // A revoked refresh token being reused indicates a stolen/replayed token.
      // Revoke every active session for this account as a precaution.
      await this.revokeAllSessionsUseCase.execute(account.id);
      throw new UnauthorizedError("Sessão comprometida detectada. Todas as sessões foram encerradas, faça login novamente.");
    }

    if (!session.isActive()) {
      throw new UnauthorizedError("Sessão expirada. Faça login novamente.");
    }

    session.revoke();
    await this.sessionRepository.save(session);

    const { token: accessToken } = this.generateTokenUseCase.execute({ type: TokenType.ACCESS, userId, version });
    const { token: newRefreshToken, expiresAt } = this.generateTokenUseCase.execute({
      type: TokenType.REFRESH,
      userId,
      version,
    });

    await this.createSessionUseCase.execute({
      accountId: account.id,
      refreshToken: newRefreshToken,
      expiresAt,
      userAgent,
      ip,
    });

    return {
      account,
      tokens: {
        access: accessToken,
        refresh: newRefreshToken,
      },
    };
  }
}
