import { Mapper } from '@goran/common';
import { Injectable } from '@nestjs/common';
import {
    OtpCodeVO,
    PasswordResetRequestAggregate,
    PasswordResetTokenVO,
} from '../../domain';
import { PasswordResetRequestModel } from '../models/password-reset-request.model';
import { UsersService } from '@goran/users';

@Injectable()
export class PasswordResetRequestMapper
    implements Mapper<PasswordResetRequestAggregate, PasswordResetRequestModel> {
    constructor(private readonly usersService: UsersService) { }
    toPersistence(
        entity: PasswordResetRequestAggregate
    ): PasswordResetRequestModel {
        const props = entity.getProps();
        return {
            id: props.id,
            status: props.status,
            userId: props.user.getProps().id,
            otpcode: props.otpcode.unpack(),
            token: props.passwordResetToken.resetToken,
            createdAt: props.createdAt,
            updatedAt: props.updatedAt,
        };
    }

    async toDomain(
        record: PasswordResetRequestModel
    ): Promise<PasswordResetRequestAggregate> {
        const userSome = await this.usersService.findOneById(record.userId);
        const entity = new PasswordResetRequestAggregate({
            id: record.id,
            createdAt: new Date(record.createdAt),
            updatedAt: new Date(record.updatedAt),
            props: {
                user: userSome.unwrap(),
                status: record.status,
                passwordResetToken: new PasswordResetTokenVO({
                    resetToken: record.token,
                }),
                otpcode: new OtpCodeVO({ value: record.otpcode }),
            },
        });
        return entity;
    }
}
