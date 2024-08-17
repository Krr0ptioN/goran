import { TokenProps, TokenValueObject } from '../../domain';
import { UserEntity } from '@goran/users';

export class AuthenticationCredentialDto {
  userId: string;
  tokens: TokenProps;

  constructor(props: { user: UserEntity; tokens: TokenValueObject }) {
    this.userId = props.user.id;
    this.tokens = props.tokens.unpack();
  }
}
