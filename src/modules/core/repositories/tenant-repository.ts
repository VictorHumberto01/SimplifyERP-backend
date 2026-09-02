import { Tenant } from "../entities/tenant";

export interface ITenantRepository {
  save(tenant: Tenant, tx?: unknown): Promise<Tenant>;
  getById(id: string): Promise<Tenant | null>;
  getByOwnerId(ownerId: string): Promise<Tenant | null>;
}
