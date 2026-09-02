import { IPersistenceMapper } from "@/core/types/persistence-mapper";
import { Tenant as PersistenceTenant } from "@prisma/client";
import { injectable } from "tsyringe";
import { Tenant as DomainTenant } from "@/modules/core/entities/tenant";

@injectable()
export class PrismaTenantMapper implements IPersistenceMapper<DomainTenant, PersistenceTenant> {
  toPersistence(tenant: DomainTenant): PersistenceTenant {
    return {
      id: tenant.id,
      name: tenant.name,
      ownerId: tenant.ownerId,
      createdAt: tenant.createdAt,
      updatedAt: tenant.updatedAt,
      deletedAt: tenant.deletedAt,
    };
  }

  toDomain(tenant: PersistenceTenant): DomainTenant {
    return DomainTenant.create(
      {
        name: tenant.name,
        ownerId: tenant.ownerId,
        createdAt: tenant.createdAt,
        updatedAt: tenant.updatedAt,
        deletedAt: tenant.deletedAt,
      },
      tenant.id,
    );
  }
}
