import { authenticator } from "otplib";
import { UnauthorizedError } from "@/core/errors/unauthorized-error";
import { BadRequestError } from "@/core/errors/bad-request.error";
import { InMemoryAccountRepository } from "@/modules/core/tests/in-memory-account-repository";
import { makeAccount } from "@/modules/core/tests/factories/make-account";
import { Account } from "../../entities/account";
import { GetAccountByIdUseCase } from "../../use-cases/account/get-account-by-id.use-case";
import { MfaSecretCipher } from "../../cryptography/mfa-secret-cipher";
import { SetupMfaService } from "./setup-mfa-service";
import { ConfirmMfaService } from "./confirm-mfa-service";

function currentCodeFor(account: Account): string {
  return authenticator.generate(MfaSecretCipher.decrypt(account.mfaSecretCipher!));
}

describe("Confirm Mfa Service", () => {
  it("enables MFA when the code matches the pending secret", async () => {
    const accountRepository = new InMemoryAccountRepository();
    const account = makeAccount();
    await accountRepository.save(account);

    const getAccountByIdUseCase = new GetAccountByIdUseCase(accountRepository);
    await new SetupMfaService(getAccountByIdUseCase, accountRepository).execute(account.id);

    const sut = new ConfirmMfaService(getAccountByIdUseCase, accountRepository);
    await sut.execute(account.id, currentCodeFor(account));

    expect(account.mfaEnabled).toBe(true);
    expect(account.mfaConfirmedAt).not.toBeNull();
  });

  it("rejects an invalid code", async () => {
    const accountRepository = new InMemoryAccountRepository();
    const account = makeAccount();
    await accountRepository.save(account);

    const getAccountByIdUseCase = new GetAccountByIdUseCase(accountRepository);
    await new SetupMfaService(getAccountByIdUseCase, accountRepository).execute(account.id);

    const sut = new ConfirmMfaService(getAccountByIdUseCase, accountRepository);
    await expect(sut.execute(account.id, "000000")).rejects.toThrow(UnauthorizedError);
  });

  it("rejects confirmation when there is no pending secret", async () => {
    const accountRepository = new InMemoryAccountRepository();
    const account = makeAccount();
    await accountRepository.save(account);

    const getAccountByIdUseCase = new GetAccountByIdUseCase(accountRepository);
    const sut = new ConfirmMfaService(getAccountByIdUseCase, accountRepository);

    await expect(sut.execute(account.id, "123456")).rejects.toThrow(BadRequestError);
  });
});
