import { inject, injectable } from "tsyringe";
import { authenticator } from "otplib";
import { BadRequestError } from "@/core/errors/bad-request.error";
import { UnauthorizedError } from "@/core/errors/unauthorized-error";
import { GetAccountByIdUseCase } from "../../use-cases/account/get-account-by-id.use-case";
import { IAccountRepository } from "../../repositories/account-repository";
import { MfaSecretCipher } from "../../cryptography/mfa-secret-cipher";

@injectable()
export class ConfirmMfaService {
  constructor(
    @inject(GetAccountByIdUseCase)
    private readonly getAccountByIdUseCase: GetAccountByIdUseCase,
    @inject("accountRepository")
    private readonly accountRepository: IAccountRepository,
  ) {}

  async execute(accountId: string, code: string): Promise<void> {
    const { account } = await this.getAccountByIdUseCase.execute({ accountId });

    if (!account.mfaSecretCipher) {
      throw new BadRequestError("Nenhuma configuração de MFA pendente. Solicite o setup primeiro.");
    }

    const secret = MfaSecretCipher.decrypt(account.mfaSecretCipher);
    const isValid = authenticator.verify({ token: code, secret });

    if (!isValid) {
      throw new UnauthorizedError("Código MFA inválido ou expirado.");
    }

    account.confirmMfa();
    await this.accountRepository.save(account);
  }
}
