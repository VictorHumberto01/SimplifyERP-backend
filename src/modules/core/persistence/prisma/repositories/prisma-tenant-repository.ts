import { PrismaDatabaseSingleton } from "@/infra/database/prisma";
import { Prisma } from "@prisma/client";
import { inject, injectable } from "tsyringe";
import { Tenant } from "@/modules/core/entities/tenant";
import { ITenantRepository } from "@/modules/core/repositories/tenant-repository";
import { PrismaTenantMapper } from "@/modules/core/persistence/prisma/mappers/prisma-tenant-mapper";

@injectable()
export class PrismaTenantRepository implements ITenantRepository {
  private prisma = PrismaDatabaseSingleton.getInstance();

  constructor(
    @inject(PrismaTenantMapper)
    private readonly prismaTenantMapper: PrismaTenantMapper,
  ) {}

  async save(tenant: Tenant, tx?: unknown): Promise<Tenant> {
    const client = (tx as Prisma.TransactionClient | undefined) ?? this.prisma;
    const persistenceData = this.prismaTenantMapper.toPersistence(tenant);

    const record = await client.tenant.upsert({
      where: { id: tenant.id },
      update: persistenceData,
      create: persistenceData,
    });

    return this.prismaTenantMapper.toDomain(record);
  }

  async getById(id: string): Promise<Tenant | null> {
    const record = await this.prisma.tenant.findUnique({ where: { id, deletedAt: null } });
    return record ? this.prismaTenantMapper.toDomain(record) : null;
  }

  async getByOwnerId(ownerId: string): Promise<Tenant | null> {
    const record = await this.prisma.tenant.findUnique({ where: { ownerId } });
    return record ? this.prismaTenantMapper.toDomain(record) : null;
  }
}
