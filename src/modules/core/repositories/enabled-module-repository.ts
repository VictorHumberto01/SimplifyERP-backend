import { ModuleKey } from "@prisma/client";
import { EnabledModule } from "../entities/enabled-module";

export interface IEnabledModuleRepository {
  save(enabledModule: EnabledModule, tx?: unknown): Promise<EnabledModule>;
  listByTenantId(tenantId: string): Promise<EnabledModule[]>;
  getByTenantAndModule(tenantId: string, module: ModuleKey): Promise<EnabledModule | null>;
}
