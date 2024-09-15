import { Module } from '@nestjs/common';
import { AuthenticationController } from './presenters/http';
import {
    SignupCommandHandler,
    SigninCommandHandler,
} from './application/commands';

@Module({
    providers: [SignupCommandHandler, SigninCommandHandler],
    controllers: [AuthenticationController],
})
export class AuthenticationModule {}
