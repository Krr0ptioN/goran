import { AggregateRoot, AggregateID, ExceptionBase } from '@goran/common';
import { ulid } from 'ulid';
import { UserEntity } from '@goran/users';
import { PasswordResetTokenVO } from '../value-objects';
import { OtpCodeVO } from '@goran/security';
import { Err, Ok, Result } from 'oxide.ts';
import {
    InvalidOtpCodeError,
    PasswordResetRequestAlreadyVerifiedError,
    PasswordResetRequestAttemptInvalidatedError,
    PasswordResetRequestMustBeVerifiedError,
} from '../errors';

export type PasswordResetRequestStatus =
    | 'requested'
    | 'verified'
    | 'successful'
    | 'dismissed';

export interface PasswordResetRequestProps {
    status: PasswordResetRequestStatus;
    user: UserEntity;
    passwordResetToken: PasswordResetTokenVO;
    otpcode: OtpCodeVO;
}

export interface RequestPasswordResetProps {
    user: UserEntity;
    passwordResetToken: PasswordResetTokenVO;
}

export class PasswordResetRequestAggregate extends AggregateRoot<PasswordResetRequestProps> {
    protected readonly _id: AggregateID;

    static create(
        request: RequestPasswordResetProps
    ): PasswordResetRequestAggregate {
        const id = ulid();
        const props: PasswordResetRequestProps = {
            ...request,
            status: 'requested',
            otpcode: OtpCodeVO.create(),
        };

        return new PasswordResetRequestAggregate({ id, props });
    }

    verify(otpcode: OtpCodeVO): Result<PasswordResetTokenVO, ExceptionBase> {
        if (this.getProps().status === 'verified')
            return Err(new PasswordResetRequestAlreadyVerifiedError());
        if (this.getProps().status !== 'requested')
            return Err(new PasswordResetRequestMustBeVerifiedError());
        if (!otpcode.equals(this.getProps().otpcode))
            return Err(new InvalidOtpCodeError());
        this.props.status = 'verified';
        return Ok(this.getProps().passwordResetToken);
    }

    passwordChanged(): Result<PasswordResetRequestStatus, ExceptionBase> {
        if (['successful', 'dismissed'].includes(this.getProps().status))
            return Err(new PasswordResetRequestAttemptInvalidatedError());
        if (this.getProps().status !== 'verified')
            return Err(new PasswordResetRequestMustBeVerifiedError());
        this.props.status = 'successful';
        return Ok(this.getProps().status);
    }

    isDismissed() {
        return this.getProps().status === 'dismissed';
    }

    isSuccessful() {
        return this.getProps().status === 'successful';
    }

    validate() {
        return;
    }
}
