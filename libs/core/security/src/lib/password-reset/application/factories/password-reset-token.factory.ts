import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PasswordResetTokenVO } from '../../domain';
import { CONFIG_APP } from '@goran/config';
import { JwtPasswordResetPayloadSign } from '../jwt-payloads';

@Injectable()
export class PasswordResetTokenFactory {
    constructor(
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService
    ) {}

    private readonly refreshSecretKey = this.configService.get<string>(
        CONFIG_APP.JWT_ACCESS_SECRET
    );

    generate(payload: JwtPasswordResetPayloadSign): PasswordResetTokenVO {
        return new PasswordResetTokenVO({
            resetToken: this.jwtService.sign(payload, {
                secret: this.refreshSecretKey,
            }),
        });
    }
}
