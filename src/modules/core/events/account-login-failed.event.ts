import { IDomainEvent } from "@/core/events/domain-event";

export class AccountLoginFailedEvent implements IDomainEvent {
  public readonly occurredAt: Date;

  constructor(
    public readonly email: string,
    public readonly reason: string,
  ) {
    this.occurredAt = new Date();
  }

  getAggregateId(): string {
    return this.email;
  }
}
