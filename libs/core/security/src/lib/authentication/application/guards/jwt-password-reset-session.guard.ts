import {
    CanActivate,
    ExecutionContext,
    Injectable,
    Logger,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { UnauthorizedException } from '@nestjs/common';
import { InvalidTokenError } from '../../domain/errors';
import { PasswordResetSessionService } from '../services/password-reset-session.service';
import { AuthenticationTokenService } from '../services';

@Injectable()
export class JwtPasswordResetSessionGuard
    extends AuthGuard('password-reset-session')
    implements CanActivate
{
    logger = new Logger(JwtPasswordResetSessionGuard.name);
    constructor(
        private readonly tokenService: AuthenticationTokenService,
        private readonly sessionService: PasswordResetSessionService
    ) {
        super();
    }

    override async canActivate(context: ExecutionContext): Promise<boolean> {
        const req = context.switchToHttp().getRequest<Request>();
        const token = this.tokenService.extractTokenFromRequest(req);

        try {
            const requestAgg = await this.sessionService.getAggByToken(token);
            const status = requestAgg.getProps().status;
            if (status === 'successful' || status === 'dismissed') {
                throw new InvalidTokenError('Invalid token provided');
            }
            return true;
        } catch (error) {
            this.logger.error(error);
            throw new UnauthorizedException('Invalid user');
        }
    }
}
