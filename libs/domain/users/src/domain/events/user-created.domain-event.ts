import { DomainEvent, DomainEventProps } from '@goran/common';

export class UserCreatedDomainEvent extends DomainEvent {
  readonly email: string;
  readonly username: string;
  readonly fullname?: string;

  constructor(props: DomainEventProps<UserCreatedDomainEvent>) {
    super(props);
    this.email = props.email;
    this.username = props.username;
    this.fullname = props.fullname;
  }
}
