import { CommandBus, CqrsModule } from '@nestjs/cqrs';
import { UsersRepository, UsersRepositoryProvider } from '../../ports';
import { Test, TestingModule } from '@nestjs/testing';
import { CreateUserCommandHandler } from './create-user.command-handler';
import { CreateUserCommand } from './create-user.command';
import { InMemoryUsersRepository } from '../../../infrastructure';
import { EventEmitter2, EventEmitterModule } from '@nestjs/event-emitter';
import { UserMapper } from '../../mappers';
import { UserEntity } from '../../../domain';

describe('Create user', () => {
    let commandBus: CommandBus;
    let repo: UsersRepository;
    let eventEmitter: EventEmitter2;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [EventEmitterModule.forRoot(), CqrsModule.forRoot()],
            providers: [
                UserMapper,
                CreateUserCommandHandler,
                {
                    provide: UsersRepositoryProvider,
                    useClass: InMemoryUsersRepository,
                },
            ],
        }).compile();

        commandBus = module.get<CommandBus>(CommandBus);
        commandBus.register([CreateUserCommandHandler]);
        eventEmitter = module.get<EventEmitter2>(EventEmitter2);
        repo = module.get<UsersRepository>(UsersRepositoryProvider);
    });

    it('should create a user', async () => {
        const userToBeCreated = InMemoryUsersRepository.generateMockUser();
        const cmdResult = await commandBus.execute(
            new CreateUserCommand({
                email: userToBeCreated.email,
                username: userToBeCreated.username,
                password: userToBeCreated.password,
                fullname: userToBeCreated.fullname,
            })
        );
        expect(cmdResult.isOk()).toBeTruthy();
    }, 100000);

    describe('Users already exist', () => {
        it('should not create a user with pre-registered email', async () => {
            const existingUserProps =
                InMemoryUsersRepository.generateMockUser();
            const existingUser = UserEntity.create(existingUserProps);
            await repo.insertOne(existingUser);

            const newUserWithSameEmail = {
                email: existingUserProps.email,
                username: 'newUsername',
                password: 'newPassword',
                fullname: 'New User',
            };
            const cmdResult = await commandBus.execute(
                new CreateUserCommand(newUserWithSameEmail)
            );

            expect(cmdResult.isErr()).toBeTruthy();
            expect(cmdResult.unwrapErr().message).toContain(
                'Email is already registered'
            );
        });

        it('should not create a user with pre-registered username', async () => {
            const existingUserProps =
                InMemoryUsersRepository.generateMockUser();
            const existingUser = UserEntity.create(existingUserProps);
            await repo.insertOne(existingUser);

            const newUserWithSameUsername = {
                email: 'newEmail@example.com',
                username: existingUserProps.username,
                password: 'newPassword',
                fullname: 'New User',
            };
            const cmdResult = await commandBus.execute(
                new CreateUserCommand(newUserWithSameUsername)
            );

            expect(cmdResult.isErr()).toBeTruthy();
            expect(cmdResult.unwrapErr().message).toContain(
                'Username is already registered'
            );
        });
    });
});
