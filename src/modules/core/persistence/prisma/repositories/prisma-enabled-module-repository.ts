import { PrismaDatabaseSingleton } from "@/infra/database/prisma";
import { ModuleKey, Prisma } from "@prisma/client";
import { inject, injectable } from "tsyringe";
import { EnabledModule } from "@/modules/core/entities/enabled-module";
import { IEnabledModuleRepository } from "@/modules/core/repositories/enabled-module-repository";
import { PrismaEnabledModuleMapper } from "@/modules/core/persistence/prisma/mappers/prisma-enabled-module-mapper";

@injectable()
export class PrismaEnabledModuleRepository implements IEnabledModuleRepository {
  private prisma = PrismaDatabaseSingleton.getInstance();

  constructor(
    @inject(PrismaEnabledModuleMapper)
    private readonly prismaEnabledModuleMapper: PrismaEnabledModuleMapper,
  ) {}

  async save(enabledModule: EnabledModule, tx?: unknown): Promise<EnabledModule> {
    const client = (tx as Prisma.TransactionClient | undefined) ?? this.prisma;
    const persistenceData = this.prismaEnabledModuleMapper.toPersistence(enabledModule);

    const record = await client.enabledModule.upsert({
      where: { id: enabledModule.id },
      update: persistenceData,
      create: persistenceData,
    });

    return this.prismaEnabledModuleMapper.toDomain(record);
  }

  async listByTenantId(tenantId: string): Promise<EnabledModule[]> {
    const records = await this.prisma.enabledModule.findMany({ where: { tenantId } });
    return records.map((record) => this.prismaEnabledModuleMapper.toDomain(record));
  }

  async getByTenantAndModule(tenantId: string, module: ModuleKey): Promise<EnabledModule | null> {
    const record = await this.prisma.enabledModule.findUnique({
      where: { tenantId_module: { tenantId, module } },
    });
    return record ? this.prismaEnabledModuleMapper.toDomain(record) : null;
  }
}
