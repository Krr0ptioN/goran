import { Test, TestingModule } from '@nestjs/testing';
import { PasswordService } from './password.service';
import { PasswordHasher } from '../../domain/password-hasher.interface';
import { BcryptPasswordHasher } from '../../infrastructure';

describe('PasswordService', () => {
  let service: PasswordService;
  const unhashedPassword = 'somehow@$str0rng-Pasowrdd';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: PasswordHasher,
          useClass: BcryptPasswordHasher,
        },
        PasswordService
      ],
    }).compile();

    service = module.get<PasswordService>(
      PasswordService
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should validate password', async () => {
    const hashPassword = await service.hashPassword(unhashedPassword);
    expect(
      service.comparePassword(unhashedPassword, hashPassword)
    ).toBeDefined();
  });

  it('should hash raw password', () => {
    expect(service.hashPassword(unhashedPassword)).not.toEqual(
      unhashedPassword
    );
  });

});
