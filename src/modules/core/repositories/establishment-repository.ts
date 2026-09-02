import { Establishment } from "../entities/establishment";

export interface IEstablishmentRepository {
  save(establishment: Establishment, tx?: unknown): Promise<Establishment>;
  listByTenantId(tenantId: string): Promise<Establishment[]>;
}
