import { BaseEntity } from '../entities/base-entity';
import { IDomainEvent } from './domain-event';

type DomainEventCallback = (event: unknown) => void;

export class DomainEvents {
  private static handlersMap: Record<string, DomainEventCallback[]> = {};
  private static markedAggregates: BaseEntity<unknown>[] = [];

  public static shouldRun = true;

  public static markAggregateForDispatch(aggregate: BaseEntity<unknown>) {
    const aggregateFound = !!this.findMarkedAggregateByID(aggregate.id);

    if (!aggregateFound) {
      this.markedAggregates.push(aggregate);
    }
  }

  private static dispatchAggregateEvents(aggregate: BaseEntity<unknown>) {
    aggregate.domainEvents.forEach((event: IDomainEvent) => this.dispatch(event));
  }

  private static removeAggregateFromMarkedDispatchList(aggregate: BaseEntity<unknown>) {
    const index = this.markedAggregates.findIndex((a) => a.equals(aggregate));

    this.markedAggregates.splice(index, 1);
  }

  private static findMarkedAggregateByID(id: string): BaseEntity<unknown> | undefined {
    return this.markedAggregates.find((aggregate) => aggregate.id === id);
  }

  public static dispatchEventsForAggregate(id: string) {
    const aggregate = this.findMarkedAggregateByID(id);

    if (aggregate) {
      this.dispatchAggregateEvents(aggregate);
      aggregate.clearEvents();
      this.removeAggregateFromMarkedDispatchList(aggregate);
    }
  }

  /**
   * Dispatches a domain event immediately without requiring a marked aggregate.
   * Used for process-level events (e.g. login attempts) that aren't tied to an
   * entity mutation captured by `BaseEntity.addDomainEvent`.
   */
  public static dispatchImmediate(event: IDomainEvent) {
    this.dispatch(event);
  }

  public static register(callback: DomainEventCallback, eventClassName: string) {
    const wasEventRegisteredBefore = eventClassName in this.handlersMap;

    if (!wasEventRegisteredBefore) {
      this.handlersMap[eventClassName] = [];
    }

    this.handlersMap[eventClassName].push(callback);
  }

  public static clearHandlers() {
    this.handlersMap = {};
  }

  public static clearMarkedAggregates() {
    this.markedAggregates = [];
  }

  private static dispatch(event: IDomainEvent) {
    const eventClassName: string = event.constructor.name;

    const isEventRegistered = eventClassName in this.handlersMap;

    if (!this.shouldRun) {
      return;
    }

    if (isEventRegistered) {
      const handlers = this.handlersMap[eventClassName];

      for (const handler of handlers) {
        handler(event);
      }
    }
  }
}
