import { authenticator } from "otplib";
import { DomainEvents } from "@/core/events/domain-events";
import { JwtEncrypter } from "@/modules/core/cryptography/jwt-encrypter";
import { InMemoryAccountRepository } from "@/modules/core/tests/in-memory-account-repository";
import { InMemorySessionRepository } from "@/modules/core/tests/in-memory-session-repository";
import { makeAccount } from "@/modules/core/tests/factories/make-account";
import { Account } from "../../entities/account";
import { Password } from "../../entities/value-objects/password";
import { AccountLoggedInEvent } from "../../events/account-logged-in.event";
import { AccountLoginFailedEvent } from "../../events/account-login-failed.event";
import { GetAccountByEmailUseCase } from "../../use-cases/account/get-account-by-email.use-case";
import { GenerateTokenUseCase } from "../../use-cases/token/generate-token.use-case";
import { CreateSessionUseCase } from "../../use-cases/session/create-session.use-case";
import { MfaSecretCipher } from "../../cryptography/mfa-secret-cipher";
import { SetupMfaService } from "../mfa/setup-mfa-service";
import { ConfirmMfaService } from "../mfa/confirm-mfa-service";
import { GetAccountByIdUseCase } from "../../use-cases/account/get-account-by-id.use-case";
import { CredentialsLoginService } from "./credentials-login-service";

const PASSWORD = "SecurePassword123";

function currentCodeFor(account: Account): string {
  return authenticator.generate(MfaSecretCipher.decrypt(account.mfaSecretCipher!));
}

function buildSut(accountRepository: InMemoryAccountRepository, sessionRepository: InMemorySessionRepository) {
  const encrypter = new JwtEncrypter();
  return new CredentialsLoginService(
    new GetAccountByEmailUseCase(accountRepository),
    new GenerateTokenUseCase(encrypter),
    new CreateSessionUseCase(sessionRepository),
  );
}

describe("Credentials Login Service", () => {
  afterEach(() => {
    DomainEvents.clearHandlers();
  });

  it("logs the account in and creates a session when MFA is disabled", async () => {
    const accountRepository = new InMemoryAccountRepository();
    const sessionRepository = new InMemorySessionRepository();
    const account = makeAccount({ password: Password.createNewPassword(PASSWORD) });
    await accountRepository.save(account);

    const handler = vi.fn();
    DomainEvents.register(handler, AccountLoggedInEvent.name);

    const sut = buildSut(accountRepository, sessionRepository);
    const result = await sut.login({ email: account.email.value, password: PASSWORD });

    expect(result.mfaRequired).toBe(false);
    if (!result.mfaRequired) {
      expect(result.accessToken).toBeDefined();
      expect(result.refreshToken).toBeDefined();
    }
    expect(sessionRepository.items).toHaveLength(1);
    expect(handler).toHaveBeenCalledOnce();
  });

  it("returns an MFA challenge instead of tokens when MFA is enabled, and does not create a session", async () => {
    const accountRepository = new InMemoryAccountRepository();
    const sessionRepository = new InMemorySessionRepository();
    const account = makeAccount({ password: Password.createNewPassword(PASSWORD) });
    await accountRepository.save(account);

    const getAccountByIdUseCase = new GetAccountByIdUseCase(accountRepository);
    await new SetupMfaService(getAccountByIdUseCase, accountRepository).execute(account.id);
    await new ConfirmMfaService(getAccountByIdUseCase, accountRepository).execute(account.id, currentCodeFor(account));

    const sut = buildSut(accountRepository, sessionRepository);
    const result = await sut.login({ email: account.email.value, password: PASSWORD });

    expect(result.mfaRequired).toBe(true);
    if (result.mfaRequired) {
      expect(result.mfaChallengeToken).toBeDefined();
    }
    expect(sessionRepository.items).toHaveLength(0);
  });

  it("dispatches AccountLoginFailedEvent on wrong password", async () => {
    const accountRepository = new InMemoryAccountRepository();
    const sessionRepository = new InMemorySessionRepository();
    const account = makeAccount({ password: Password.createNewPassword(PASSWORD) });
    await accountRepository.save(account);

    const handler = vi.fn();
    DomainEvents.register(handler, AccountLoginFailedEvent.name);

    const sut = buildSut(accountRepository, sessionRepository);
    await expect(sut.login({ email: account.email.value, password: "WrongPassword123" })).rejects.toThrow();

    expect(handler).toHaveBeenCalledOnce();
  });

  it("dispatches AccountLoginFailedEvent when the account does not exist", async () => {
    const accountRepository = new InMemoryAccountRepository();
    const sessionRepository = new InMemorySessionRepository();

    const handler = vi.fn();
    DomainEvents.register(handler, AccountLoginFailedEvent.name);

    const sut = buildSut(accountRepository, sessionRepository);
    await expect(sut.login({ email: "missing@example.com", password: PASSWORD })).rejects.toThrow();

    expect(handler).toHaveBeenCalledOnce();
  });
});
