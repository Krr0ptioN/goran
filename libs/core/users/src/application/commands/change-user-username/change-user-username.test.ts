import { ChangeUserUsernameCommandHandler } from './change-user-username.command-handler';
import { ChangeUserUsernameCommand } from './change-user-username.command';
import { WriteModelUsersRepository } from '../../ports';
import { Option, Some, None } from 'oxide.ts';

describe('ChangeUserUsernameCommandHandler', () => {
  let handler: ChangeUserUsernameCommandHandler;
  let userRepo: jest.Mocked<WriteModelUsersRepository>;
  let user: any;

  beforeEach(() => {
    userRepo = {
      updateUsername: jest.fn(),
    } as any;
    handler = new ChangeUserUsernameCommandHandler(userRepo);
    user = { getProps: () => ({ email: 'user@example.com' }) };
  });

  it('should return updated user if update is successful', async () => {
    const updatedUser = { ...user };
    userRepo.updateUsername.mockResolvedValue(Some(updatedUser));
    const command = new ChangeUserUsernameCommand({ user, newUsername: 'newuser' });
    const result = await handler.execute(command);
    expect(result.isSome()).toBe(true);
    expect(result.unwrap()).toBe(updatedUser);
  });

  it('should return none if update fails', async () => {
    userRepo.updateUsername.mockResolvedValue(None);
    const command = new ChangeUserUsernameCommand({ user, newUsername: 'newuser' });
    const result = await handler.execute(command);
    expect(result.isNone()).toBe(true);
  });
});
