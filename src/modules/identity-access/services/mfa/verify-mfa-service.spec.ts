import { authenticator } from "otplib";
import { TokenType } from "@/core/enums/token-type";
import { UnauthorizedError } from "@/core/errors/unauthorized-error";
import { JwtEncrypter } from "@/modules/identity-access/cryptography/jwt-encrypter";
import { InMemoryAccountRepository } from "@/modules/identity-access/tests/in-memory-account-repository";
import { InMemorySessionRepository } from "@/modules/identity-access/tests/in-memory-session-repository";
import { makeAccount } from "@/modules/identity-access/tests/factories/make-account";
import { Account } from "../../entities/account";
import { GetAccountByIdUseCase } from "../../use-cases/account/get-account-by-id.use-case";
import { GenerateTokenUseCase } from "../../use-cases/token/generate-token.use-case";
import { VerifyTokenUseCase } from "../../use-cases/token/verify-token.use-case";
import { CreateSessionUseCase } from "../../use-cases/session/create-session.use-case";
import { MfaSecretCipher } from "../../cryptography/mfa-secret-cipher";
import { SetupMfaService } from "./setup-mfa-service";
import { ConfirmMfaService } from "./confirm-mfa-service";
import { VerifyMfaService } from "./verify-mfa-service";

function currentCodeFor(account: Account): string {
  return authenticator.generate(MfaSecretCipher.decrypt(account.mfaSecretCipher!));
}

async function buildAccountWithMfaEnabled() {
  const accountRepository = new InMemoryAccountRepository();
  const account = makeAccount();
  await accountRepository.save(account);

  const getAccountByIdUseCase = new GetAccountByIdUseCase(accountRepository);
  await new SetupMfaService(getAccountByIdUseCase, accountRepository).execute(account.id);
  await new ConfirmMfaService(getAccountByIdUseCase, accountRepository).execute(account.id, currentCodeFor(account));

  return { accountRepository, account, getAccountByIdUseCase };
}

describe("Verify Mfa Service", () => {
  it("issues access/refresh tokens and creates a session when the code is valid", async () => {
    const { account, getAccountByIdUseCase } = await buildAccountWithMfaEnabled();
    const encrypter = new JwtEncrypter();
    const sessionRepository = new InMemorySessionRepository();

    const { token: mfaChallengeToken } = new GenerateTokenUseCase(encrypter).execute({
      userId: account.id,
      type: TokenType.MFA_CHALLENGE,
      version: account.passwordResetVersion,
    });

    const sut = new VerifyMfaService(
      new VerifyTokenUseCase(encrypter),
      getAccountByIdUseCase,
      new GenerateTokenUseCase(encrypter),
      new CreateSessionUseCase(sessionRepository),
    );

    const result = await sut.execute({ mfaChallengeToken, code: currentCodeFor(account) });

    expect(result.accessToken).toBeDefined();
    expect(result.refreshToken).toBeDefined();
    expect(sessionRepository.items).toHaveLength(1);
  });

  it("rejects a wrong code", async () => {
    const { account, getAccountByIdUseCase } = await buildAccountWithMfaEnabled();
    const encrypter = new JwtEncrypter();

    const { token: mfaChallengeToken } = new GenerateTokenUseCase(encrypter).execute({
      userId: account.id,
      type: TokenType.MFA_CHALLENGE,
      version: account.passwordResetVersion,
    });

    const sut = new VerifyMfaService(
      new VerifyTokenUseCase(encrypter),
      getAccountByIdUseCase,
      new GenerateTokenUseCase(encrypter),
      new CreateSessionUseCase(new InMemorySessionRepository()),
    );

    await expect(sut.execute({ mfaChallengeToken, code: "000000" })).rejects.toThrow(UnauthorizedError);
  });

  it("rejects a token that is not an MFA challenge token", async () => {
    const { account, getAccountByIdUseCase } = await buildAccountWithMfaEnabled();
    const encrypter = new JwtEncrypter();

    const { token: accessToken } = new GenerateTokenUseCase(encrypter).execute({
      userId: account.id,
      type: TokenType.ACCESS,
      version: account.passwordResetVersion,
    });

    const sut = new VerifyMfaService(
      new VerifyTokenUseCase(encrypter),
      getAccountByIdUseCase,
      new GenerateTokenUseCase(encrypter),
      new CreateSessionUseCase(new InMemorySessionRepository()),
    );

    await expect(sut.execute({ mfaChallengeToken: accessToken, code: currentCodeFor(account) })).rejects.toThrow(
      UnauthorizedError,
    );
  });
});
