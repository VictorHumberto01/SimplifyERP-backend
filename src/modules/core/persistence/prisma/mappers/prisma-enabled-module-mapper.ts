import { IPersistenceMapper } from "@/core/types/persistence-mapper";
import { EnabledModule as PersistenceEnabledModule } from "@prisma/client";
import { injectable } from "tsyringe";
import { EnabledModule as DomainEnabledModule } from "@/modules/core/entities/enabled-module";

@injectable()
export class PrismaEnabledModuleMapper
  implements IPersistenceMapper<DomainEnabledModule, PersistenceEnabledModule>
{
  toPersistence(enabledModule: DomainEnabledModule): PersistenceEnabledModule {
    return {
      id: enabledModule.id,
      tenantId: enabledModule.tenantId,
      module: enabledModule.module,
      enabled: enabledModule.enabled,
      createdAt: enabledModule.createdAt,
      updatedAt: enabledModule.updatedAt,
    };
  }

  toDomain(enabledModule: PersistenceEnabledModule): DomainEnabledModule {
    return DomainEnabledModule.create(
      {
        tenantId: enabledModule.tenantId,
        module: enabledModule.module,
        enabled: enabledModule.enabled,
        createdAt: enabledModule.createdAt,
        updatedAt: enabledModule.updatedAt,
      },
      enabledModule.id,
    );
  }
}
