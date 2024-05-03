import { Strategy, ExtractJwt } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtDto } from '../dto';
import { UsersService } from '@goran/users';
import { UserEntity } from '@goran/users';
import { CONFIG_APP } from '@goran/config';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly userService: UsersService,
    readonly configService: ConfigService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: `${configService.get<string>(CONFIG_APP.JWT_ACCESS_SECRET)}`,
    });
  }

  async validate(payload: JwtDto): Promise<UserEntity> {
    const user = await this.userService.findOne({ id: payload.userId });
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
