import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { USERS_REPOSITORY } from '../repositories';
import { MockUsersRepository } from '../repositories/user-mock.repository';

describe('UsersService', () => {
  let service: UsersService;
  let repo: MockUsersRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: USERS_REPOSITORY,
          useClass: MockUsersRepository,
        },
        UsersService,
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repo = module.get<MockUsersRepository>(USERS_REPOSITORY);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should be query all users', async () => {
    const result = await service.findAll();
    expect(result).toBeTruthy();
    if (result) {
      result.map((user) => {
        expect(user.id).toBeDefined();
        expect(user.email).toBeDefined();
        expect(user.username).toBeDefined();
      });
    }
  });

  it('should query a specific user with email', () => {
    expect(service.findOne({ email: repo.usersList[0].email })).toBeDefined();
  });

  it('should query a specific user with id', () => {
    expect(service.findOneById(0)).toBeDefined();
    expect(service.findOne({ id: 0 })).toBeDefined();
  });

  it('should query a specific user with username', () => {
    expect(
      service.findOne({ username: repo.usersList[0].username })
    ).toBeDefined();
  });

  it('should create a new user', () => {
    const { createdAt, updatedAt, id, ...user } = repo.generateMockUser();
    expect(service.create(user)).toBeDefined();
  });

  it('should update a user', async () => {
    const result = await service.update(0, { username: 'newUserName' });
    expect(result).toBeTruthy();
    expect(result).toBeDefined();
    result && expect(result.username).toEqual('newUserName');
  });

  it('should delete a user', async () => {
    const user = repo.usersList[0];
    const result = await service.delete({ username: user.username });
    expect(result).toBeTruthy();
    expect(result).toBeDefined();
    result && expect(result.username).toEqual(user.username);
    expect(repo.usersList[0]).toBeUndefined();
  });
});
