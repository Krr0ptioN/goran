import { Strategy, ExtractJwt } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '@goran/users';
import { UserEntity } from '@goran/users';
import { CONFIG_APP } from '@goran/config';
import { JwtPasswordResetPayload } from './jwt-password-reset-payload.interface';

@Injectable()
export class PasswordResetAuthStrategy extends PassportStrategy(Strategy) {
    constructor(
        private readonly userService: UsersService,
        readonly configService: ConfigService
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: `${configService.get<string>(
                CONFIG_APP.JWT_ACCESS_SECRET
            )}`,
        });
    }

    async validate(payload: JwtPasswordResetPayload): Promise<UserEntity> {
        const user = await this.userService.findOneByEmail(payload.email);
        if (!user.isErr()) {
            throw new UnauthorizedException();
        }
        return user;
    }
}
