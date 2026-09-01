import { inject, injectable } from "tsyringe";
import { authenticator } from "otplib";
import { GetAccountByIdUseCase } from "../../use-cases/account/get-account-by-id.use-case";
import { IAccountRepository } from "../../repositories/account-repository";
import { MfaSecretCipher } from "../../cryptography/mfa-secret-cipher";

const ISSUER = "SimplifyERP";

@injectable()
export class SetupMfaService {
  constructor(
    @inject(GetAccountByIdUseCase)
    private readonly getAccountByIdUseCase: GetAccountByIdUseCase,
    @inject("accountRepository")
    private readonly accountRepository: IAccountRepository,
  ) {}

  async execute(accountId: string): Promise<{ otpauthUrl: string }> {
    const { account } = await this.getAccountByIdUseCase.execute({ accountId });

    const secret = authenticator.generateSecret();
    account.setPendingMfaSecret(MfaSecretCipher.encrypt(secret));
    await this.accountRepository.save(account);

    const otpauthUrl = authenticator.keyuri(account.email.value, ISSUER, secret);

    return { otpauthUrl };
  }
}
