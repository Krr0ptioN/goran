import { Token } from '../entities';
import { UserEntity } from '@goran/users';
import { AuthenticationTokenService } from './token.service';

export class AuthenticationTokenServiceMock
    implements
    Omit<AuthenticationTokenService, 'isTokenRevoked' | 'getUserFromToken'> {
    generateTokens(payload: { userId: number }): Token {
        payload.userId;
        const token = {
            accessToken: 'fakeAccessToken',
            refreshToken: 'fakeRefreshToken',
        };
        return token;
    }

    async refreshToken(user: UserEntity, refreshToken: string): Promise<Token> {
        user;
        refreshToken;
        return {
            accessToken: 'newFakeAccessToken',
            refreshToken: 'newFakeRefreshToken',
        };
    }

    async revokeToken(token: string): Promise<void> {
        token;
    }
}
