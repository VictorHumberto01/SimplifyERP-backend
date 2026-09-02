import { IDomainEvent } from "@/core/events/domain-event";

export class TenantCreated implements IDomainEvent {
  public readonly occurredAt: Date;

  constructor(
    public readonly tenantId: string,
    public readonly ownerId: string,
  ) {
    this.occurredAt = new Date();
  }

  getAggregateId(): string {
    return this.tenantId;
  }
}
