import { ArgumentInvalidException, Guard, ValueObject } from '@goran/common';

export interface TokenProps {
  accessToken: string;
  refreshToken: string;
}

export class TokenValueObject extends ValueObject<TokenProps> {
  get accessToken() {
    return this.props.accessToken;
  }

  get refreshToken() {
    return this.props.accessToken;
  }

  protected override validate(props: TokenProps): void {
    if (Guard.isEmpty(props.accessToken) || Guard.isEmpty(props.refreshToken))
      throw new ArgumentInvalidException(
        'Neither access token and refresh token can be empty'
      );
  }
}
