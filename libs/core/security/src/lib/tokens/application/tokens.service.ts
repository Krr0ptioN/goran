import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '@goran/users';
import { Request } from 'express';

@Injectable()
export class TokensService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly usersService: UsersService
    ) { }

    async getUserFromToken(token: string) {
        const id = this.jwtService.decode(token)['userId'];
        const user = await this.usersService.findOneById(id);
        return user;
    }

    async refreshTokenIsValid(refreshToken: string): Promise<boolean> {
        try {
            const decodedRefreshToken = await this.jwtService.verify(
                refreshToken
            );
            return !!decodedRefreshToken;
        } catch (error) {
            return false;
        }
    }

    extractTokenFromRequest(req: Request) {
        const token = req.headers?.authorization?.split(' ')[1];
        if (!token) {
            throw new UnauthorizedException('Token must be provided');
        }
        return token;
    }
}
