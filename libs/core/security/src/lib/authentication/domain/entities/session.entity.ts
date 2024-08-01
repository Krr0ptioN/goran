import { AggregateRoot, AggregateID } from '@goran/common';
import { ulid } from 'ulid';
import { RequireOnlyOne } from '@goran/common';
import { TokenValueObject } from '../value-objects';
import { UserEntity } from '@goran/users';

export interface SessionProps {
  tokens: TokenValueObject;
  user: UserEntity;
}

export interface CreateUserProps {
  tokens: TokenValueObject;
  user: UserEntity;
}

export type UpdateUserProps = RequireOnlyOne<CreateUserProps>;

export class SessionEntity extends AggregateRoot<SessionProps> {
  protected readonly _id: AggregateID;

  static create(create: CreateUserProps): SessionEntity {
    const id = ulid();
    const props: SessionProps = { ...create };
    const session = new SessionEntity({ id, props });
    return session;
  }

  validate() {}
}
