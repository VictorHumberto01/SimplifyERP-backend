import { IPersistenceMapper } from "@/core/types/persistence-mapper";
import { Establishment as PersistenceEstablishment } from "@prisma/client";
import { injectable } from "tsyringe";
import { Establishment as DomainEstablishment } from "@/modules/core/entities/establishment";

@injectable()
export class PrismaEstablishmentMapper
  implements IPersistenceMapper<DomainEstablishment, PersistenceEstablishment>
{
  toPersistence(establishment: DomainEstablishment): PersistenceEstablishment {
    return {
      id: establishment.id,
      tenantId: establishment.tenantId,
      name: establishment.name,
      document: establishment.document,
      createdAt: establishment.createdAt,
      updatedAt: establishment.updatedAt,
      deletedAt: establishment.deletedAt,
    };
  }

  toDomain(establishment: PersistenceEstablishment): DomainEstablishment {
    return DomainEstablishment.create(
      {
        tenantId: establishment.tenantId,
        name: establishment.name,
        document: establishment.document,
        createdAt: establishment.createdAt,
        updatedAt: establishment.updatedAt,
        deletedAt: establishment.deletedAt,
      },
      establishment.id,
    );
  }
}
