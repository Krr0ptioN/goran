import { ChangeUserPasswordCommandHandler } from './change-user-password.command-handler';
import { ChangeUserPasswordCommand } from './change-user-password.command';
import { WriteModelUsersRepository } from '../../ports';
import { Option, Some, None } from 'oxide.ts';

describe('ChangeUserPasswordCommandHandler', () => {
  let handler: ChangeUserPasswordCommandHandler;
  let userRepo: jest.Mocked<WriteModelUsersRepository>;
  let user: any;

  beforeEach(() => {
    userRepo = {
      updateUsername: jest.fn(),
    } as any;
    handler = new ChangeUserPasswordCommandHandler(userRepo);
    user = { getProps: () => ({ email: 'user@example.com' }) };
  });

  it('should return updated user if update is successful', async () => {
    const updatedUser = { ...user };
    userRepo.updateUsername.mockResolvedValue(Some(updatedUser));
    const command = new ChangeUserPasswordCommand({ user, newHashedPassword: 'hashed' });
    const result = await handler.execute(command);
    expect(result.isSome()).toBe(true);
    expect(result.unwrap()).toBe(updatedUser);
  });

  it('should return none if update fails', async () => {
    userRepo.updateUsername.mockResolvedValue(None);
    const command = new ChangeUserPasswordCommand({ user, newHashedPassword: 'hashed' });
    const result = await handler.execute(command);
    expect(result.isNone()).toBe(true);
  });
});
