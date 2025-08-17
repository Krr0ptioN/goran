import { ChangeUserEmailCommandHandler } from './change-user-email.command-handler';
import { ChangeUserEmailCommand } from './change-user-email.command';
import { EmailAlreadyRegisteredError, UserNotFoundError, UserEntity } from '../../../domain';
import { ReadModelUsersRepository, WriteModelUsersRepository } from '../../ports';
import { ConflictException } from '@goran/common';
import { Option, Some, None, Ok, Err } from 'oxide.ts';

describe('ChangeUserEmailCommandHandler', () => {
  let handler: ChangeUserEmailCommandHandler;
  let userWriteRepo: jest.Mocked<WriteModelUsersRepository>;
  let userReadRepo: jest.Mocked<ReadModelUsersRepository>;
  let user: UserEntity;

  beforeEach(() => {
    userWriteRepo = {
      updateEmail: jest.fn(),
    } as any;
    userReadRepo = {
      findOneByEmail: jest.fn(),
    } as any;
    handler = new ChangeUserEmailCommandHandler(userWriteRepo, userReadRepo);
    user = { getProps: () => ({ email: 'old@example.com' }) } as any;
  });

  it('should return error if new email is already registered', async () => {
    userReadRepo.findOneByEmail.mockResolvedValue(Some({} as any));
    const command = new ChangeUserEmailCommand({ newEmail: 'new@example.com', user });
    const result = await handler.execute(command);
    expect(result.isErr()).toBe(true);
    expect(result.unwrapErr()).toBeInstanceOf(EmailAlreadyRegisteredError);
  });

  it('should return error if update throws ConflictException', async () => {
    userReadRepo.findOneByEmail.mockResolvedValue(None);
    userWriteRepo.updateEmail.mockRejectedValue(new ConflictException('not found'));
    const command = new ChangeUserEmailCommand({ newEmail: 'new@example.com', user });
    const result = await handler.execute(command);
    expect(result.isErr()).toBe(true);
    expect(result.unwrapErr()).toBeInstanceOf(UserNotFoundError);
  });

  it('should return updated user on success', async () => {
    userReadRepo.findOneByEmail.mockResolvedValue(None);
    const updatedUser = { ...user } as UserEntity;
    userWriteRepo.updateEmail.mockResolvedValue(Some(updatedUser));
    const command = new ChangeUserEmailCommand({ newEmail: 'new@example.com', user });
    const result = await handler.execute(command);
    expect(result.isOk()).toBe(true);
    expect(result.unwrap()).toBe(updatedUser);
  });
});
