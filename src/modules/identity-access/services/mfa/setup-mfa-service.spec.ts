import { InMemoryAccountRepository } from "@/modules/identity-access/tests/in-memory-account-repository";
import { makeAccount } from "@/modules/identity-access/tests/factories/make-account";
import { GetAccountByIdUseCase } from "../../use-cases/account/get-account-by-id.use-case";
import { MfaSecretCipher } from "../../cryptography/mfa-secret-cipher";
import { SetupMfaService } from "./setup-mfa-service";

describe("Setup Mfa Service", () => {
  it("generates and stores an encrypted pending secret, without enabling MFA yet", async () => {
    const accountRepository = new InMemoryAccountRepository();
    const account = makeAccount();
    await accountRepository.save(account);

    const sut = new SetupMfaService(new GetAccountByIdUseCase(accountRepository), accountRepository);

    const { otpauthUrl } = await sut.execute(account.id);

    expect(otpauthUrl).toContain("otpauth://totp/");
    expect(account.mfaEnabled).toBe(false);
    expect(account.mfaSecretCipher).not.toBeNull();

    // The secret must never be stored in plain text.
    const decrypted = MfaSecretCipher.decrypt(account.mfaSecretCipher!);
    expect(account.mfaSecretCipher).not.toContain(decrypted);
  });
});
