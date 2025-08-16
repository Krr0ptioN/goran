import { Strategy, ExtractJwt } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from '../jwt-payloads';
import { UserMapper, UsersService } from '@goran/users';
import { UserEntity } from '@goran/users';
import { CONFIG_APP } from '@goran/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly userService: UsersService,
    private readonly mapper: UserMapper,
    private readonly configService: ConfigService,
  ) {
    const secret = configService.getOrThrow<string>(CONFIG_APP.JWT_ACCESS_SECRET);

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: secret,
      ignoreExpiration: true,
    });
  }

  async validate(payload: JwtPayload): Promise<UserEntity> {
    const userResult = await this.userService.findOneById(payload.userId);
    if (!userResult.isSome()) throw new UnauthorizedException();
    return this.mapper.toDomain(userResult.unwrap());
  }
}
