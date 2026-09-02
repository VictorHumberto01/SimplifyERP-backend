import { validate } from "@/core/utils/validate";
import { DomainEvents } from "@/core/events/domain-events";
import { IUnitOfWork } from "@/core/unit-of-work/unit-of-work";
import { ModuleKey } from "@prisma/client";
import { inject, injectable } from "tsyringe";
import { object, string } from "yup";
import { Account } from "../../entities/account";
import { Tenant } from "../../entities/tenant";
import { Establishment } from "../../entities/establishment";
import { EnabledModule } from "../../entities/enabled-module";
import { AccountRole } from "../../entities/value-objects/role";
import { ITenantRepository } from "../../repositories/tenant-repository";
import { IEstablishmentRepository } from "../../repositories/establishment-repository";
import { IEnabledModuleRepository } from "../../repositories/enabled-module-repository";
import { IAccountRepository } from "../../repositories/account-repository";
import { CreateAccountUseCase } from "../account/create-account.use-case";

interface ICreateTenantWithEstablishmentRequest {
  ownerName: string;
  email: string;
  password: string;
  establishmentName: string;
  establishmentDocument?: string | null;
}

// Modules turned on automatically at signup, matching the MVP scope in
// docs/modules.md — Estoque/Financeiro/Fiscal stay off until the tenant
// enables them later via PATCH /v1/establishment/modules/:module.
const DEFAULT_ENABLED_MODULES: ModuleKey[] = [ModuleKey.DIGITAL_MENU, ModuleKey.POS];

const signupSchema = object({
  ownerName: string().trim().min(2, "Nome inválido.").required("Nome é obrigatório."),
  email: string().email("E-mail inválido.").required("E-mail é obrigatório."),
  password: string().min(8, "A senha deve ter pelo menos 8 caracteres.").required("Senha é obrigatória."),
  establishmentName: string().trim().min(2, "Nome do estabelecimento inválido.").required("Nome do estabelecimento é obrigatório."),
});

@injectable()
export class CreateTenantWithEstablishmentUseCase {
  constructor(
    @inject("unitOfWork")
    private readonly unitOfWork: IUnitOfWork,
    @inject(CreateAccountUseCase)
    private readonly createAccountUseCase: CreateAccountUseCase,
    @inject("accountRepository")
    private readonly accountRepository: IAccountRepository,
    @inject("tenantRepository")
    private readonly tenantRepository: ITenantRepository,
    @inject("establishmentRepository")
    private readonly establishmentRepository: IEstablishmentRepository,
    @inject("enabledModuleRepository")
    private readonly enabledModuleRepository: IEnabledModuleRepository,
  ) {}

  async execute(
    request: ICreateTenantWithEstablishmentRequest,
  ): Promise<{ account: Account; tenant: Tenant; establishment: Establishment }> {
    await validate(signupSchema, request);

    return this.unitOfWork.runInTransaction(async (tx) => {
      const { account } = await this.createAccountUseCase.execute(
        {
          name: request.ownerName,
          email: request.email,
          password: request.password,
          role: AccountRole.OWNER,
          mustChangePassword: false,
        },
        tx,
      );

      const tenant = Tenant.create({ name: request.establishmentName, ownerId: account.id });
      await this.tenantRepository.save(tenant, tx);

      account.assignTenant(tenant.id);
      await this.accountRepository.save(account, tx);

      const establishment = Establishment.create({
        tenantId: tenant.id,
        name: request.establishmentName,
        document: request.establishmentDocument ?? null,
      });
      await this.establishmentRepository.save(establishment, tx);

      for (const module of DEFAULT_ENABLED_MODULES) {
        await this.enabledModuleRepository.save(
          EnabledModule.create({ tenantId: tenant.id, module, enabled: true }),
          tx,
        );
      }

      DomainEvents.dispatchEventsForAggregate(tenant.id);

      return { account, tenant, establishment };
    });
  }
}
