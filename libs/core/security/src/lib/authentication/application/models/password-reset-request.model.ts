import { AggregateID } from '@goran/common';
import { PasswordResetRequestStatus } from '../../domain';

export interface PasswordResetRequestModel {
    id: AggregateID;
    status: PasswordResetRequestStatus;
    userId: AggregateID;
    token: string;
    otpcode: string;
    createdAt: Date;
    updatedAt: Date;
}
