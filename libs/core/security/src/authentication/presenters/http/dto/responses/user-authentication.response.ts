import { Token } from '../../../../domain/value-objects';
import { AggregateID } from '@goran/common';

export class UserAuthenticationResponseDto {
    userId: AggregateID;
    tokens: Token;
}
