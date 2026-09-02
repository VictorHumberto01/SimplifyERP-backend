import { IDomainEvent } from "@/core/events/domain-event";

export class AccountLoggedInEvent implements IDomainEvent {
  public readonly occurredAt: Date;

  constructor(
    public readonly accountId: string,
    public readonly email: string,
  ) {
    this.occurredAt = new Date();
  }

  getAggregateId(): string {
    return this.accountId;
  }
}
