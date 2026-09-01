import { TokenType } from "@/core/enums/token-type";
import { UnauthorizedError } from "@/core/errors/unauthorized-error";
import { JwtEncrypter } from "@/modules/identity-access/cryptography/jwt-encrypter";
import { InMemoryAccountRepository } from "@/modules/identity-access/tests/in-memory-account-repository";
import { InMemorySessionRepository } from "@/modules/identity-access/tests/in-memory-session-repository";
import { makeAccount } from "@/modules/identity-access/tests/factories/make-account";
import { GetAccountByIdUseCase } from "../../use-cases/account/get-account-by-id.use-case";
import { GenerateTokenUseCase } from "../../use-cases/token/generate-token.use-case";
import { VerifyTokenUseCase } from "../../use-cases/token/verify-token.use-case";
import { CreateSessionUseCase } from "../../use-cases/session/create-session.use-case";
import { FindSessionByRefreshTokenUseCase } from "../../use-cases/session/find-session-by-refresh-token.use-case";
import { RevokeAllSessionsUseCase } from "../../use-cases/session/revoke-all-sessions.use-case";
import { RefreshAuthService } from "./refresh-auth-service";

function buildSut() {
  const accountRepository = new InMemoryAccountRepository();
  const sessionRepository = new InMemorySessionRepository();
  const encrypter = new JwtEncrypter();

  const verifyTokenUseCase = new VerifyTokenUseCase(encrypter);
  const getAccountByIdUseCase = new GetAccountByIdUseCase(accountRepository);
  const generateTokenUseCase = new GenerateTokenUseCase(encrypter);
  const createSessionUseCase = new CreateSessionUseCase(sessionRepository);
  const findSessionByRefreshTokenUseCase = new FindSessionByRefreshTokenUseCase(sessionRepository);
  const revokeAllSessionsUseCase = new RevokeAllSessionsUseCase(sessionRepository);

  const sut = new RefreshAuthService(
    verifyTokenUseCase,
    getAccountByIdUseCase,
    generateTokenUseCase,
    createSessionUseCase,
    findSessionByRefreshTokenUseCase,
    revokeAllSessionsUseCase,
    sessionRepository,
  );

  return { sut, accountRepository, sessionRepository, generateTokenUseCase, createSessionUseCase };
}

describe("Refresh Auth Service", () => {
  it("rotates the refresh token: revokes the old session and creates a new one", async () => {
    const { sut, accountRepository, sessionRepository, generateTokenUseCase, createSessionUseCase } = buildSut();
    const account = makeAccount();
    await accountRepository.save(account);

    const { token: refreshToken, expiresAt } = generateTokenUseCase.execute({
      userId: account.id,
      type: TokenType.REFRESH,
      version: account.passwordResetVersion,
    });
    const { session: firstSession } = await createSessionUseCase.execute({
      accountId: account.id,
      refreshToken,
      expiresAt,
    });

    const result = await sut.execute({ refreshToken });

    expect(result.tokens.refresh).not.toBe(refreshToken);
    expect(sessionRepository.items).toHaveLength(2);

    const revokedFirstSession = await sessionRepository.findById(firstSession.id);
    expect(revokedFirstSession?.revokedAt).not.toBeNull();
  });

  it("detects reuse of an already-rotated refresh token and revokes every active session", async () => {
    const { sut, accountRepository, sessionRepository, generateTokenUseCase, createSessionUseCase } = buildSut();
    const account = makeAccount();
    await accountRepository.save(account);

    const { token: refreshToken, expiresAt } = generateTokenUseCase.execute({
      userId: account.id,
      type: TokenType.REFRESH,
      version: account.passwordResetVersion,
    });
    await createSessionUseCase.execute({ accountId: account.id, refreshToken, expiresAt });

    // First refresh: legitimate rotation.
    await sut.execute({ refreshToken });

    // Second refresh reusing the same (now revoked) refresh token: must be treated as theft.
    await expect(sut.execute({ refreshToken })).rejects.toThrow(UnauthorizedError);

    const activeSessions = await sessionRepository.listActiveByAccountId(account.id);
    expect(activeSessions).toHaveLength(0);
  });

  it("rejects a refresh token that has no matching session", async () => {
    const { sut, accountRepository, generateTokenUseCase } = buildSut();
    const account = makeAccount();
    await accountRepository.save(account);

    const { token: refreshToken } = generateTokenUseCase.execute({
      userId: account.id,
      type: TokenType.REFRESH,
      version: account.passwordResetVersion,
    });

    await expect(sut.execute({ refreshToken })).rejects.toThrow(UnauthorizedError);
  });
});
