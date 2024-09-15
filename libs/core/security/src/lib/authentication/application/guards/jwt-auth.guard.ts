import {
    CanActivate,
    ExecutionContext,
    Injectable,
    Logger,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { UnauthorizedException } from '@nestjs/common';
import {
    InvalidTokenError,
    SessionsService,
    TokensService,
} from '@goran/security';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') implements CanActivate {
    logger = new Logger(JwtAuthGuard.name);
    constructor(
        private readonly tokenService: TokensService,
        private readonly sessionsService: SessionsService
    ) {
        super();
    }

    override async canActivate(context: ExecutionContext): Promise<boolean> {
        const req = context.switchToHttp().getRequest<Request>();
        const token = this.tokenService.extractTokenFromRequest(req);

        try {
            const user = await this.tokenService.getUserFromToken(token);
            if (user.isNone()) {
                throw new InvalidTokenError();
            }
            const isTokenRevoked =
                await this.sessionsService.isRefreshTokenRevoked(token);

            if (isTokenRevoked.isErr() || isTokenRevoked.unwrap()) {
                throw new UnauthorizedException();
            }

            req.user = user;
            return true;
        } catch (error) {
            throw new InvalidTokenError();
        }
    }
}
