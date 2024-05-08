import {
  Injectable,
  ConflictException,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { Token } from '../entities';
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
  ) {}
  private logger = new Logger(AuthenticationService.name);

  async signup(
    payload: SignUpDto
  ): Promise<{ user: UserEntityInfo; tokens: Token }> {
    const hashedPassword = this.passwordService.hashPassword(payload.password);
    try {
      const user: UserEntityInfo | null = await this.usersService.create({
        ...payload,
        password: hashedPassword,
      });

      if (user) {
        const tokens = this.tokenService.generateTokens({
          userId: user.id,
        });
        this.logger.log(`New user signed up: ${user.email}`);
        return { user, tokens };
      } else {
        throw new InternalServerErrorException(
          'Unable to create a user with the provided credentials'
        );
      }
    } catch (error) {
      this.logger.error(error);
      throw new ConflictException(`Email ${payload.email} already used.`);
    }
  }

  public async signin(
    credentials: SignInDto
  ): Promise<{ user: UserEntityInfo; tokens: Token }> {
    const { email, password, username } = credentials;
    if (!email && !username) {
      throw new BadRequestException(
        'Either email or username has to be provided'
      );
    }
    try {
      const user = await this.validate({
        email,
        username,
        password,
      });
      if (user) {
        const tokens = this.tokenService.generateTokens({
          userId: user.id,
        });

        return { user, tokens };
      } else {
        throw new BadRequestException('Invalid crednetials has been provided.');
      }
    } catch (error) {
      throw new BadRequestException(
        'User not found or the provided credential is invalid.'
      );
    }
  }

  public async validate(
    credential: VadliateUserPasswordDto
  ): Promise<UserEntityInfo | null> {
    const foundedUser = await this.usersService.findOne({
      email: credential.email,
      username: credential.username,
    });
    if (foundedUser) {
      const { password: userPassword, ...userInfo } = foundedUser;
      const passwordValidity = await this.passwordService.validatePassword(
        credential.password,
        userPassword
      );
      if (passwordValidity) {
        return userInfo;
      } else {
        return null;
      }
    } else {
      throw new NotFoundException(
        'User not found or the provided credential is invalid.'
      );
    }
  }
}
