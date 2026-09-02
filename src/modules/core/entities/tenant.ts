import { BaseEntity } from "@/core/entities/base-entity";
import { Optional } from "@/core/types/optional";
import { TenantCreated } from "../events/tenant-created.event";

export interface ITenantProps {
  name: string;
  ownerId: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export class Tenant extends BaseEntity<ITenantProps> {
  get name() {
    return this.props.name;
  }

  get ownerId() {
    return this.props.ownerId;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  get deletedAt() {
    return this.props.deletedAt;
  }

  static create(props: Optional<ITenantProps, "createdAt" | "updatedAt" | "deletedAt">, id?: string) {
    const tenant = new Tenant(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
        updatedAt: props.updatedAt ?? new Date(),
        deletedAt: props.deletedAt ?? null,
      },
      id,
    );

    const isNewTenant = !id;
    if (isNewTenant) {
      tenant.addDomainEvent(new TenantCreated(tenant.id, tenant.ownerId));
    }

    return tenant;
  }
}
