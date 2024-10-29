import {
    CanActivate,
    ExecutionContext,
    Injectable,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { UnauthorizedException } from '@nestjs/common';
import {
    InvalidTokenError,
    TokensService,
} from '../../../tokens';
import { SessionsService } from '../../../sessions';
import { PinoLogger, InjectPinoLogger } from 'nestjs-pino';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') implements CanActivate {
    constructor(
        private readonly tokenService: TokensService,
        private readonly sessionsService: SessionsService,
        @InjectPinoLogger(JwtAuthGuard.name)
        private readonly logger: PinoLogger
    ) {
        super();
    }

    override async canActivate(context: ExecutionContext): Promise<boolean> {
        const req = context.switchToHttp().getRequest<Request>();
        const token = this.tokenService.extractTokenFromRequest(req);

        try {
            const user = await this.tokenService.getUserFromToken(token);
            if (user.isNone()) {
                this.logger.error("Couldn't find any user with this associating token");
                throw new InvalidTokenError();
            }
            const isTokenRevoked =
                await this.sessionsService.isRefreshTokenRevoked(token);
            const userProps = user.unwrap();

            const userIdentifiers = {
                email: userProps.email,
                id: userProps.id,
                username: userProps.username,
                fullname: userProps.fullname,
            }

            if (isTokenRevoked.isErr() || isTokenRevoked.unwrap()) {
                this.logger.error(userIdentifiers, 'User session is revoked');
                throw new UnauthorizedException();
            }

            req.user = userIdentifiers;
            return true;
        } catch (error) {
            console.log(error)
            throw new InvalidTokenError();
        }
    }
}
