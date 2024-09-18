import { Logger } from '@nestjs/common';
import { SignOutCommand } from './sign-out.command';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SessionsService } from '../../../../sessions';
import { Result, Ok } from 'oxide.ts';
import { ExceptionBase } from '@goran/common';

@CommandHandler(SignOutCommand)
export class SignOutCommandHandler implements ICommandHandler<SignOutCommand> {
    private readonly logger = new Logger(SignOutCommand.name);

    constructor(private readonly sessionsService: SessionsService) {}

    async execute(
        command: SignOutCommand
    ): Promise<Result<true, ExceptionBase>> {
        const { refreshToken } = command;

        const sessionRevokeResult =
            await this.sessionsService.revokeSessionByRefreshToken(
                refreshToken
            );
        
        if(sessionRevokeResult.isErr())
            return sessionRevokeResult;

        await this.sessionsService.deleteSession(
            sessionRevokeResult.unwrap().getProps().refreshToken
        );

        return Ok(true);
    }
}
