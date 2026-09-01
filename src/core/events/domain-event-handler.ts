import { IDomainEvent } from './domain-event';

export interface IDomainEventHandler<DomainEvent extends IDomainEvent> {
  handle(event: DomainEvent): Promise<void>;
  setupHandler(): void;
}
