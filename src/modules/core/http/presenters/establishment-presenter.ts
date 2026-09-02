import { Establishment } from "@/modules/core/entities/establishment";

export class EstablishmentPresenter {
  static toHttp(establishment: Establishment) {
    return {
      id: establishment.id,
      tenantId: establishment.tenantId,
      name: establishment.name,
      document: establishment.document,
      createdAt: establishment.createdAt,
    };
  }
}
