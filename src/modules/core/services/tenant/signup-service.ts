import { inject, injectable } from "tsyringe";
import { TokenType } from "@/core/enums/token-type";
import { DomainEvents } from "@/core/events/domain-events";
import { ForbiddenError } from "@/core/errors/forbidden-error";
import { ISignupDto } from "../../dtos/signup.dto";
import { Account } from "../../entities/account";
import { AccountRole } from "../../entities/value-objects/role";
import { AccountLoggedInEvent } from "../../events/account-logged-in.event";
import { CreateTenantWithEstablishmentUseCase } from "../../use-cases/tenant/create-tenant-with-establishment.use-case";
import { GenerateTokenUseCase } from "../../use-cases/token/generate-token.use-case";
import { CreateSessionUseCase } from "../../use-cases/session/create-session.use-case";

@injectable()
export class SignupService {
  constructor(
    @inject(CreateTenantWithEstablishmentUseCase)
    private readonly createTenantWithEstablishmentUseCase: CreateTenantWithEstablishmentUseCase,
    @inject(GenerateTokenUseCase)
    private readonly generateTokenUseCase: GenerateTokenUseCase,
    @inject(CreateSessionUseCase)
    private readonly createSessionUseCase: CreateSessionUseCase,
  ) {}

  async execute({ userAgent, ip, ...request }: ISignupDto, requester: Account) {
    // Por enquanto o app é entregue como uma consultoria: só o super admin
    // cria tenants (com seus donos), não há cadastro público self-service.
    if (!requester.role.hasPermission(AccountRole.SUPER_ADMIN)) {
      throw new ForbiddenError("Você não tem permissão para criar um novo tenant.");
    }

    const { account, tenant, establishment } = await this.createTenantWithEstablishmentUseCase.execute(request);

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

    return { account, tenant, establishment, accessToken, refreshToken };
  }
}
