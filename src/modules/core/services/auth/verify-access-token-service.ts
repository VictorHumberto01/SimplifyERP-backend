import { UnauthorizedError } from "@/core/errors/unauthorized-error";
import { TokenType } from "@/core/enums/token-type";
import { inject, injectable } from "tsyringe";
import { GetAccountByIdUseCase } from "../../use-cases/account/get-account-by-id.use-case";
import { VerifyTokenUseCase } from "../../use-cases/token/verify-token.use-case";

@injectable()
export class VerifyAccessTokenService {
  constructor(
    @inject(VerifyTokenUseCase) private readonly verifyTokenUseCase: VerifyTokenUseCase,
    @inject(GetAccountByIdUseCase) private readonly getAccountByIdUseCase: GetAccountByIdUseCase,
  ) {}

  async execute({ accessToken }: { accessToken: string }) {
    const { userId, type, version } = await this.verifyTokenUseCase.execute({ token: accessToken });
    if (type !== TokenType.ACCESS || version === undefined) {
      throw new UnauthorizedError("Token inválido");
    }

    const { account } = await this.getAccountByIdUseCase.execute({ accountId: userId });
    if (account.passwordResetVersion !== version) {
      throw new UnauthorizedError("Sessão expirada devido a troca de senha.");
    }

    return { account };
  }
}
