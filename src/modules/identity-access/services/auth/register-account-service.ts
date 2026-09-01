import { inject, injectable } from "tsyringe";
import { TokenType } from "@/core/enums/token-type";
import { DomainEvents } from "@/core/events/domain-events";
import { IRegisterAccountDto } from "../../dtos/auth.dto";
import { AccountRole } from "../../entities/value-objects/role";
import { AccountLoggedInEvent } from "../../events/account-logged-in.event";
import { CreateAccountUseCase } from "../../use-cases/account/create-account.use-case";
import { GenerateTokenUseCase } from "../../use-cases/token/generate-token.use-case";
import { CreateSessionUseCase } from "../../use-cases/session/create-session.use-case";

@injectable()
export class RegisterAccountService {
  constructor(
    @inject(CreateAccountUseCase)
    private readonly createAccountUseCase: CreateAccountUseCase,
    @inject(GenerateTokenUseCase)
    private readonly generateTokenUseCase: GenerateTokenUseCase,
    @inject(CreateSessionUseCase)
    private readonly createSessionUseCase: CreateSessionUseCase,
  ) {}

  async execute({ userAgent, ip, ...request }: IRegisterAccountDto) {
    const { account } = await this.createAccountUseCase.execute({
      ...request,
      role: AccountRole.USER,
      mustChangePassword: false,
    });

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
