import { ModuleKey } from "@prisma/client";
import { inject, injectable } from "tsyringe";
import { IEnabledModuleRepository } from "../../repositories/enabled-module-repository";

// CORE is implicit and always on — never listed as a toggle.
export const TOGGLEABLE_MODULES: ModuleKey[] = [
  ModuleKey.DIGITAL_MENU,
  ModuleKey.POS,
  ModuleKey.INVENTORY,
  ModuleKey.FINANCE,
  ModuleKey.FISCAL_REPORTS,
];

interface IListEnabledModulesRequest {
  tenantId: string;
}

interface IModuleStatus {
  module: ModuleKey;
  enabled: boolean;
}

@injectable()
export class ListEnabledModulesUseCase {
  constructor(
    @inject("enabledModuleRepository")
    private readonly enabledModuleRepository: IEnabledModuleRepository,
  ) {}

  async execute({ tenantId }: IListEnabledModulesRequest): Promise<{ modules: IModuleStatus[] }> {
    const rows = await this.enabledModuleRepository.listByTenantId(tenantId);
    const enabledByModule = new Map(rows.map((row) => [row.module, row.enabled]));

    const modules = TOGGLEABLE_MODULES.map((module) => ({
      module,
      enabled: enabledByModule.get(module) ?? false,
    }));

    return { modules };
  }
}
