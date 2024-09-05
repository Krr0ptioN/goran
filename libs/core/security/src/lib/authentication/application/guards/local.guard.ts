import {
    CanActivate,
    ExecutionContext,
    Injectable,
    Logger,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthenticationTokenService } from '../services';
import { Request } from 'express';
import { UnauthorizedException } from '@nestjs/common';
import { InvalidTokenError } from '../../domain/errors';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') implements CanActivate {
    logger = new Logger(LocalAuthGuard.name);
    constructor(private readonly tokenService: AuthenticationTokenService) {
        super();
    }

    override async canActivate(context: ExecutionContext): Promise<boolean> {
        const req = context.switchToHttp().getRequest<Request>();
        const accessToken = req.headers?.authorization?.split(' ')[1];
        if (!accessToken) {
            throw new UnauthorizedException('Invalid token');
        }

        try {
            const user = await this.tokenService.getUserFromToken(accessToken);
            if (user.isErr()) {
                throw new InvalidTokenError('Invalid token provided');
            }
            const isTokenRevoked = await this.tokenService.isTokenRevoked(
                accessToken
            );
            if (isTokenRevoked === true) {
                throw new UnauthorizedException('Token has been revoked');
            }
            req.user = user;
            return true;
        } catch (error) {
            this.logger.error(error);
            throw new UnauthorizedException('Invalid user');
        }
    }
}
