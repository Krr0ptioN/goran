import { Strategy, ExtractJwt } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserMapper, UsersService } from '@goran/users';
import { UserEntity } from '@goran/users';
import { CONFIG_APP } from '@goran/config';
import { JwtPasswordResetPayload } from '../jwt-payloads';

@Injectable()
export class PasswordResetAuthStrategy extends PassportStrategy(Strategy) {
    constructor(
        private readonly userService: UsersService,
        private readonly mapper: UserMapper,
        readonly configService: ConfigService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: `${configService.get<string>(
                CONFIG_APP.JWT_ACCESS_SECRET
            )}`,
        });
    }

    async validate(payload: JwtPasswordResetPayload): Promise<UserEntity> {
        const userResult = await this.userService.findOneByEmail(payload.email);
        if (userResult.isErr()) {
            throw new UnauthorizedException();
        }
        return await this.mapper.toDomain(userResult.unwrap());
    }
}
