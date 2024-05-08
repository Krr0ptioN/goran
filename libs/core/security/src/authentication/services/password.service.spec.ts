import { Test, TestingModule } from '@nestjs/testing';
import { AuthenticationPasswordService } from './password.service';
import { CacheModule } from '@nestjs/cache-manager';
import { UsersModule, UsersService, UsersServiceMock } from '@goran/users';
import { MailModule, MailService, MailServiceMock } from '@goran/mail';

describe('PasswordService', () => {
  let service: AuthenticationPasswordService;
  let mailService: MailServiceMock;
  let usersService: UsersServiceMock;
  const unhashedPassword = 'somehow@$str0rng-Pasowrdd';
  const payload = {
    email: 'hiwa@goran.com',
    password: '5trong@p4ssword#',
    username: 'hiwaamedi',
    fullname: 'Hiwa Amedi',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        UsersModule,
        MailModule,
        CacheModule.register({ isGlobal: true }),
      ],
      providers: [AuthenticationPasswordService],
    })
      .overrideProvider(UsersService)
      .useClass(UsersServiceMock)
      .overrideProvider(MailService)
      .useClass(MailServiceMock)
      .compile();

    mailService = module.get<MailServiceMock>(MailService);
    usersService = module.get<UsersServiceMock>(UsersService);
    service = module.get<AuthenticationPasswordService>(
      AuthenticationPasswordService
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should validate password', async () => {
    const hashPassword = await service.hashPassword(unhashedPassword);
    expect(
      service.validatePassword(unhashedPassword, hashPassword)
    ).toBeDefined();
  });

  it('should hash raw password', () => {
    expect(service.hashPassword(unhashedPassword)).not.toEqual(
      unhashedPassword
    );
  });

  it('should accept reset password request and change password', async () => {
    usersService.create(payload);
    await service.requestResetPassword({ email: payload.email });
    expect(mailService.sentMails.length).not.toEqual(0);
    const mail = mailService.sentMails[mailService.sentMails.length - 1];
    expect(mail.text).toBeDefined();
    expect(mail.to).toEqual(payload.email);
    const parts = mail.text.split('/');
    const token = parts[parts.length - 1];
    const result = await service.verifyPasswordResetAttempt(
      { newPassword: unhashedPassword },
      token
    );

    expect(result.message).toBeDefined();
  });
});
