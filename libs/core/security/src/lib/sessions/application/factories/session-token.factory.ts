import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { TokenValueObject } from '../../../tokens/domain';
import { CONFIG_APP } from '@goran/config';
import { JwtPayloadSign } from '../../domain/jwt-payloads';

@Injectable()
export class SessionTokenFactory {
    constructor(
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService
    ) { }

    private readonly logger = new Logger(SessionTokenFactory.name);

    private readonly refreshSecretKey = this.configService.get<string>(
        CONFIG_APP.JWT_REFRESH_SECRET
    );
    private readonly refreshIn = this.configService.get<number>(
        CONFIG_APP.SECURITY_REFRESH_IN
    );

    generateAccessTokenForRefreshToken(
        refreshToken: string,
        payload: JwtPayloadSign
    ): TokenValueObject {
        return new TokenValueObject({
            accessToken: this.generateAccessToken(payload),
            refreshToken,
        });
    }

    generateTokens(payload: JwtPayloadSign): TokenValueObject {
        return new TokenValueObject({
            accessToken: this.generateAccessToken(payload),
            refreshToken: this.generateRefreshToken(payload),
        });
    }

    private generateAccessToken(payload: JwtPayloadSign): string {
        return this.jwtService.sign(payload, { secret: this.refreshSecretKey });
    }

    private generateRefreshToken(payload: JwtPayloadSign): string {
        return this.jwtService.sign(payload, {
            secret: this.refreshSecretKey,
            expiresIn: this.refreshIn,
        });
    }
}
