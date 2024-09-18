import { CommandBus, CqrsModule } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { EventEmitter2, EventEmitterModule } from '@nestjs/event-emitter';
import { DeleteUserCommandHandler } from './delete-user.command-handler';
import {
    InMemoryUsersRepository,
    UsersRepository,
    UsersRepositoryProvider,
    UserMapper,
} from '@goran/users';

describe('Create user', () => {
    let commandBus: CommandBus;
    let repo: UsersRepository;
    let eventEmitter: EventEmitter2;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [EventEmitterModule.forRoot(), CqrsModule.forRoot()],
            providers: [
                UserMapper,
                DeleteUserCommandHandler,
                {
                    provide: UsersRepositoryProvider,
                    useClass: InMemoryUsersRepository,
                },
            ],
        }).compile();

        commandBus = module.get<CommandBus>(CommandBus);
        commandBus.register([DeleteUserCommandHandler]);
        eventEmitter = module.get<EventEmitter2>(EventEmitter2);
        repo = module.get<UsersRepository>(UsersRepositoryProvider);
    });

    it('should delete a user successfully', async () => {});

    it('should return an error if the user is not found', async () => {});

    it('should handle a ConflictException and return a UserNotFoundError', async () => {});

    it('should throw an error if an unexpected error occurs', async () => {});
});
