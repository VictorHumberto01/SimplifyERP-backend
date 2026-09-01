import { randomUUID } from 'crypto';
import { IDomainEvent } from '../events/domain-event';
import { DomainEvents } from '../events/domain-events';

export abstract class BaseEntity<Props> {
  private _id: string;
  protected props: Props;
  private _domainEvents: IDomainEvent[] = [];

  get domainEvents(): IDomainEvent[] {
    return this._domainEvents;
  }

  public get id() {
    return this._id;
  }

  public equals(entity: BaseEntity<unknown>) {
    return entity.id === this.id;
  }

  protected constructor(props: Props, id?: string) {
    this.props = props;
    this._id = id ?? randomUUID();
  }

  protected addDomainEvent(event: IDomainEvent, dispatchNow: boolean = false) {
    this._domainEvents.push(event);

    DomainEvents.markAggregateForDispatch(this);

    if (dispatchNow) {
      DomainEvents.dispatchEventsForAggregate(this.id);
    }
  }

  public clearEvents() {
    this._domainEvents = [];
  }
}
