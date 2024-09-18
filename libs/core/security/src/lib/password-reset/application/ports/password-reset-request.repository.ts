import { Option, Result } from 'oxide.ts';
import { PasswordResetRequestAggregate } from '../../domain';
import { AggregateID, ExceptionBase } from '@goran/common';
import { PasswordResetRequestModel } from '../models/password-reset-request.model';

export abstract class PasswordResetRequestRepository {
    abstract save(
        request: PasswordResetRequestAggregate
    ): Promise<Result<PasswordResetRequestAggregate, ExceptionBase>>;

    abstract delete(
        request: PasswordResetRequestAggregate
    ): Promise<Result<PasswordResetRequestAggregate, ExceptionBase>>;

    abstract findOneById(
        id: AggregateID
    ): Promise<Option<PasswordResetRequestModel>>;

    abstract findOneByToken(
        token: string
    ): Promise<Option<PasswordResetRequestModel>>;
}
