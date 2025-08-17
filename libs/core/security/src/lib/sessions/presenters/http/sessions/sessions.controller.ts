import {
    Controller,
    Delete,
    Get,
    InternalServerErrorException,
    Param,
    Post,
    Query,
    UnauthorizedException,
    UseGuards,
} from '@nestjs/common';
import { SessionStatus } from '../../../domain';
import { SessionDto, SessionsService } from '../../../application';
import { JwtAuthGuard } from '../../../../authentication/application/guards/jwt-auth.guard';
import { ApiTags } from '@nestjs/swagger';
import { match, Result } from 'oxide.ts';
import { GetSessionsSuccessResponse } from './get-sessions.response';
import { DeleteSessionSuccessResponse } from './delete-session.response';
import { CurrentUser, UserEntity } from '@goran/users';
import { RevokedSessionSuccessResponse } from './revoked-session.response';
import { ExceptionBase } from '@goran/common';

@Controller()
@UseGuards(JwtAuthGuard)
export class SessionsController {
    constructor(private readonly sessionsService: SessionsService) { }

    @ApiTags('users', 'sessions')
    @Get('/users/:id/sessions')
    async getSessions(
        @Param('id') userId: string,
        @CurrentUser() user: UserEntity,
        @Query('status') status?: SessionStatus
    ) {
        if (user.id !== userId) throw new UnauthorizedException();
        const sessions = await this.sessionsService.getSessionsByUser(userId, status);
        return match(sessions, {
            Ok: (sessions: SessionDto[]) => new GetSessionsSuccessResponse({ sessions }),
            Err: (error: Error) => {
                throw error;
            }
        })
    }

    @ApiTags('users', 'sessions')
    @Get('/@me/sessions')
    async getUsersSessions(
        @CurrentUser() user: UserEntity,
        @Query('status') status?: SessionStatus
    ) {
        const sessions = await this.sessionsService.getSessionsByUser(user.id, status);
        return match(sessions, {
            Ok: (sessions: SessionDto[]) => new GetSessionsSuccessResponse({ sessions }),
            Err: (error: Error) => {
                throw error;
            }
        })
    }

    @ApiTags('sessions')
    @Post('/sessions/:id/revoke')
    async revokeSession(@Param('id') sessionId: string) {
        const result = await this.sessionsService.revokeSession(sessionId);
        return match(result, {
            Ok: () => new RevokedSessionSuccessResponse(),
            Err: (error: Error) => {
                throw error;
            }
        });
    }

    @ApiTags('sessions')
    @Delete('/sessions/:id')
    async deleteSession(@Param('id') sessionId: string) {
        const result: Result<true, ExceptionBase> = await this.sessionsService.deleteSession(sessionId);
        return match(result, {
            Ok: () => new DeleteSessionSuccessResponse(),
            Err: (error: ExceptionBase) => {
                throw new InternalServerErrorException(error);
            }
        });
    }
}
