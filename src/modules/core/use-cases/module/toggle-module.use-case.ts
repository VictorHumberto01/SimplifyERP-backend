import { BadRequestError } from "@/core/errors/bad-request.error";
import { DomainEvents } from "@/core/events/domain-events";
import { ModuleKey } from "@prisma/client";
import { inject, injectable } from "tsyringe";
import { EnabledModule } from "../../entities/enabled-module";
import { IEnabledModuleRepository } from "../../repositories/enabled-module-repository";
import { ModuleEnabled } from "../../events/module-enabled.event";

interface IToggleModuleRequest {
  tenantId: string;
  module: ModuleKey;
  enabled: boolean;
}

@injectable()
export class ToggleModuleUseCase {
  constructor(
    @inject("enabledModuleRepository")
    private readonly enabledModuleRepository: IEnabledModuleRepository,
  ) {}

  async execute({ tenantId, module, enabled }: IToggleModuleRequest): Promise<{ enabledModule: EnabledModule }> {
    if (module === ModuleKey.CORE) {
      throw new BadRequestError("O módulo Core é sempre habilitado e não pode ser alterado.");
    }

    const enabledModule =
      (await this.enabledModuleRepository.getByTenantAndModule(tenantId, module)) ??
      EnabledModule.create({ tenantId, module, enabled });

    enabledModule.setEnabled(enabled);
    await this.enabledModuleRepository.save(enabledModule);

    DomainEvents.dispatchImmediate(new ModuleEnabled(tenantId, module, enabled));

    return { enabledModule };
  }
}
