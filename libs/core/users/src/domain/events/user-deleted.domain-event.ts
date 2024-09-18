import { DomainEvent, DomainEventProps } from '@goran/common';

export class UserDeletedDomainEvent extends DomainEvent {
    constructor(props: DomainEventProps<UserDeletedDomainEvent>) {
        super(props);
    }
}
