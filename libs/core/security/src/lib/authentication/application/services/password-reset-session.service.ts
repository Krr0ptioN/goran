import { BadRequestException, Injectable } from '@nestjs/common';
import { PasswordResetRequestRepository } from '../ports';
import { InvalidAuthenticationCredentials } from '../../domain';
import { PasswordResetRequestMapper } from '../mappers';

@Injectable()
export class PasswordResetSessionService {
    constructor(
        private readonly mapper: PasswordResetRequestMapper,
        private readonly repository: PasswordResetRequestRepository) { }

    async getAggByToken(token: string) {
        const requestResult = await this.repository.findOneByToken(
            token
        );

        if (requestResult.isNone())
            throw new BadRequestException(
                new InvalidAuthenticationCredentials(
                    Error('Provided credenetials are invalid')
                )
            );

        return await this.mapper.toDomain(requestResult.unwrap());
    }
}
