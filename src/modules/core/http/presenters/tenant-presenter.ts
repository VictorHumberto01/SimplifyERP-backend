import { Tenant } from "@/modules/core/entities/tenant";

export class TenantPresenter {
  static toHttp(tenant: Tenant) {
    return {
      id: tenant.id,
      name: tenant.name,
      ownerId: tenant.ownerId,
      createdAt: tenant.createdAt,
    };
  }
}
