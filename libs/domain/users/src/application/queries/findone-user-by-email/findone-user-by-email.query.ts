import { QueryBase } from '@goran/common';

export class FindOneUserByEmailQuery extends QueryBase {
  readonly email: string;

  constructor(email: string) {
    super();
    this.email = email;
  }
}
