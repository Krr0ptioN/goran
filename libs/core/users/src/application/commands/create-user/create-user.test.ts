import { Test, TestingModule } from '@nestjs/testing';
import { CqrsModule } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';
import { CreateUserCommandHandler } from './create-user.command-handler';
import { CreateUserCommand } from './create-user.command';
import { WriteModelUsersRepository } from '../../ports';
import { UserEntity, UserCreationFailedError } from '../../../domain';
import { Ok, Err } from 'oxide.ts';
import {
    generateTestPassword,
    generateTestEmail,
    generateTestUsername,
} from '@goran/utils';

const TEST_PASSWORD = generateTestPassword();
const TEST_EMAIL = generateTestEmail();
const TEST_EMAIL_2 = generateTestEmail();
const TEST_USERNAME = generateTestUsername();

describe('CreateUserCommandHandler', () => {
    let handler: CreateUserCommandHandler;
    let userRepo: jest.Mocked<WriteModelUsersRepository>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [CqrsModule],
            providers: [
                CreateUserCommandHandler,
                {
                    provide: WriteModelUsersRepository,
                    useValue: {
                        insertOne: jest.fn(),
                    },
                },
                {
                    provide: Logger,
                    useValue: {
                        debug: jest.fn(),
                        verbose: jest.fn(),
                    },
                },
            ],
        }).compile();

        handler = module.get<CreateUserCommandHandler>(
            CreateUserCommandHandler,
        );
        userRepo = module.get(WriteModelUsersRepository);
    });

    it('should create a user successfully', async () => {
        const command = new CreateUserCommand({
            email: TEST_EMAIL,
            username: TEST_USERNAME,
            password: TEST_PASSWORD,
        });

        const user = UserEntity.create(command);
        userRepo.insertOne.mockResolvedValue(Ok(user));

        const result = await handler.execute(command);

        expect(result.isOk()).toBe(true);
        if (result.isOk()) {
            expect(result.unwrap()).toEqual(user);
        }
    });

    it('should not create a user with pre-registered email', async () => {
        const command = new CreateUserCommand({
            email: TEST_EMAIL,
            username: TEST_USERNAME,
            password: TEST_PASSWORD,
        });

        const error = new UserCreationFailedError();
        userRepo.insertOne.mockResolvedValue(Err(error));

        const result = await handler.execute(command);

        expect(result.isErr()).toBe(true);
        if (result.isErr()) {
            expect(result.unwrapErr()).toBe(error);
        }
        expect(userRepo.insertOne).toHaveBeenCalledWith(expect.any(UserEntity));
    });

    it('should not create a user with pre-registered username', async () => {
        const command = new CreateUserCommand({
            email: TEST_EMAIL_2,
            username: TEST_USERNAME,
            password: TEST_PASSWORD,
        });

        const error = new UserCreationFailedError();
        userRepo.insertOne.mockResolvedValue(Err(error));

        const result = await handler.execute(command);

        expect(result.isErr()).toBe(true);
        if (result.isErr()) {
            expect(result.unwrapErr()).toBe(error);
        }
        expect(userRepo.insertOne).toHaveBeenCalledWith(expect.any(UserEntity));
    });
});
