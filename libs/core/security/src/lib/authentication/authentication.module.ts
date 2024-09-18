import { Global, Module } from '@nestjs/common';
import { AuthenticationController } from './presenters/http';
import {
    SignUpCommandHandler,
    SignInCommandHandler,
    SignOutCommandHandler,
    JwtStrategy,
} from './application';
import { SessionsController } from '../sessions/presenters/http/sessions';

@Global()
@Module({
    imports: [],
    providers: [
        SignOutCommandHandler,
        SignUpCommandHandler,
        SignInCommandHandler,
        JwtStrategy,
    ],
    controllers: [SessionsController, AuthenticationController],
})
export class AuthenticationModule {}
