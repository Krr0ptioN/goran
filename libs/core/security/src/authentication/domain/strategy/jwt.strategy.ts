import { Strategy, ExtractJwt } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtPayloadDto } from '../dto';
import { UsersService } from '@goran/users';
import { UserEntity } from '@goran/users';
import { CONFIG_APP } from '@goran/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private readonly userService: UsersService,
        readonly configService: ConfigService
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: `${configService.get<string>(CONFIG_APP.JWT_ACCESS_SECRET)}`,
        });
    }

    async validate(payload: JwtPayloadDto): Promise<UserEntity> {
        const user = await this.userService.findOneById(payload.userId);
        if (!user) {
            throw new UnauthorizedException();
        }
        return user;
    }
}
