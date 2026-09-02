import { PrismaDatabaseSingleton } from "@/infra/database/prisma";
import { Prisma } from "@prisma/client";
import { inject, injectable } from "tsyringe";
import { Establishment } from "@/modules/core/entities/establishment";
import { IEstablishmentRepository } from "@/modules/core/repositories/establishment-repository";
import { PrismaEstablishmentMapper } from "@/modules/core/persistence/prisma/mappers/prisma-establishment-mapper";

@injectable()
export class PrismaEstablishmentRepository implements IEstablishmentRepository {
  private prisma = PrismaDatabaseSingleton.getInstance();

  constructor(
    @inject(PrismaEstablishmentMapper)
    private readonly prismaEstablishmentMapper: PrismaEstablishmentMapper,
  ) {}

  async save(establishment: Establishment, tx?: unknown): Promise<Establishment> {
    const client = (tx as Prisma.TransactionClient | undefined) ?? this.prisma;
    const persistenceData = this.prismaEstablishmentMapper.toPersistence(establishment);

    const record = await client.establishment.upsert({
      where: { id: establishment.id },
      update: persistenceData,
      create: persistenceData,
    });

    return this.prismaEstablishmentMapper.toDomain(record);
  }

  async listByTenantId(tenantId: string): Promise<Establishment[]> {
    const records = await this.prisma.establishment.findMany({ where: { tenantId, deletedAt: null } });
    return records.map((record) => this.prismaEstablishmentMapper.toDomain(record));
  }
}
