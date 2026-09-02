import { IDomainEvent } from "@/core/events/domain-event";
import { ModuleKey } from "@prisma/client";

export class ModuleEnabled implements IDomainEvent {
  public readonly occurredAt: Date;

  constructor(
    public readonly tenantId: string,
    public readonly module: ModuleKey,
    public readonly enabled: boolean,
  ) {
    this.occurredAt = new Date();
  }

  getAggregateId(): string {
    return this.tenantId;
  }
}
