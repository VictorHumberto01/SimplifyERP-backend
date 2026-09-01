import { IDomainEvent } from "@/core/events/domain-event";

export class PasswordChangedEvent implements IDomainEvent {
  public readonly occurredAt: Date;

  constructor(public readonly accountId: string) {
    this.occurredAt = new Date();
  }

  getAggregateId(): string {
    return this.accountId;
  }
}
