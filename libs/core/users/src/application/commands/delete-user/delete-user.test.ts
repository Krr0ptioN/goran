import { Test, TestingModule } from '@nestjs/testing';
import { DeleteUserCommandHandler } from './delete-user.command-handler';
import { WriteModelUsersRepository } from '../../ports/users.repository';
import { UserMapper } from '../../mappers';
import { DeleteUserCommand } from './delete-user.command';
import { Err, Ok, Result } from 'oxide.ts';
import { UserNotFoundError } from '../../../domain/errors';
import { UserEntity } from '../../../domain/entities/user/user.entity';
import {
    generateTestPassword,
    generateTestEmail,
    generateTestUsername,
} from '@goran/utils';

const TEST_PASSWORD = generateTestPassword();
const TEST_EMAIL = generateTestEmail();
const TEST_USERNAME = generateTestUsername();

describe('DeleteUserCommandHandler', () => {
    let commandHandler: DeleteUserCommandHandler;
    let userRepo: WriteModelUsersRepository;

    const mockUser: UserEntity = UserEntity.create({
        email: TEST_EMAIL,
        username: TEST_USERNAME,
        password: TEST_PASSWORD,
        fullname: 'Test User',
    });

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UserMapper,
                DeleteUserCommandHandler,
                {
                    provide: WriteModelUsersRepository,
                    useValue: {
                        delete: jest.fn(),
                    },
                },
            ],
        }).compile();

        commandHandler = module.get<DeleteUserCommandHandler>(
            DeleteUserCommandHandler,
        );
        userRepo = module.get<WriteModelUsersRepository>(
            WriteModelUsersRepository,
        );
    });

    it('should delete a user successfully', async () => {
        const command = new DeleteUserCommand({ user: mockUser });
        jest.spyOn(userRepo, 'delete').mockResolvedValue(Ok(true));

        const result: Result<boolean, any> =
            await commandHandler.execute(command);

        expect(result.isOk()).toBe(true);
        expect(userRepo.delete).toHaveBeenCalledWith(mockUser);
    });

    it('should return a UserNotFoundError if the user is not found', async () => {
        const command = new DeleteUserCommand({ user: mockUser });
        jest.spyOn(userRepo, 'delete').mockResolvedValue(
            Err(new UserNotFoundError()),
        );

        const result: Result<boolean, any> =
            await commandHandler.execute(command);

        expect(result.isErr()).toBe(true);
        expect(result.unwrapErr()).toBeInstanceOf(UserNotFoundError);
    });

    it('should throw an error if an unexpected error occurs', async () => {
        const command = new DeleteUserCommand({ user: mockUser });
        const unexpectedError = new Error('Unexpected error');
        jest.spyOn(userRepo, 'delete').mockRejectedValue(unexpectedError);

        await expect(commandHandler.execute(command)).rejects.toThrow(
            unexpectedError,
        );
    });
});
