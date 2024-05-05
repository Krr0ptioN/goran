import {
    Injectable,
    ConflictException,
    NotFoundException,
    BadRequestException,
    InternalServerErrorException,
} from '@nestjs/common';
import { Token } from '../entities';
import { Response } from 'express';
import { AuthenticationTokenService } from '../services/token.service';
import { AuthenticationPasswordService } from '../services/password.service';
import { UserEntityInfo, UsersService } from '@goran/users';
import { VadliateUserPasswordDto, SignInDto, SignUpDto } from '../dto';

@Injectable()
export class AuthenticationService {
    constructor(
        private tokenService: AuthenticationTokenService,
        private passwordService: AuthenticationPasswordService,
        private usersService: UsersService
    ) { }

    async signup(
        payload: SignUpDto
    ): Promise<{ user: UserEntityInfo; tokens: Token }> {
        const hashedPassword = await this.passwordService.hashPassword(
            payload.password
        );

        try {
            const user = await this.usersService.create({
                ...payload,
                password: hashedPassword,
            });

            if (user) {
                const tokens = this.tokenService.generateTokens({
                    userId: user.id,
                });
                return { user, tokens };
            } else {
                throw new InternalServerErrorException('Unable to create a user with the provided credentials')
            }
        } catch (error) {
            throw new ConflictException(`Email ${payload.email} already used.`);
        }
    }

    public async signin(
        input: SignInDto
    ): Promise<{ user: UserEntityInfo; tokens: Token }> {
        const { email, password } = input;
        try {
            const user = await this.validate({ email, password });
            const tokens = this.tokenService.generateTokens({
                userId: user.id,
            });

            return { user, tokens };
        } catch (error) {
            throw new BadRequestException(
                'User not found or provided information is invalid.'
            );
        }
    }

    public async validate(
        credential: VadliateUserPasswordDto
    ): Promise<UserEntityInfo> {
        const foundedUser = await this.usersService.findOne({
            email: credential.email,
        });
        if (foundedUser) {
            const { password: userPassword, ...userInfo } = foundedUser;
            const passwordValidity = await this.passwordService.validatePassword(
                credential.password,
                userPassword
            );
            if (passwordValidity) {
                return userInfo;
            }
        }
        throw new NotFoundException(
            'User not found or the provided credential is invalid.'
        );
    }

    }
  }
}
