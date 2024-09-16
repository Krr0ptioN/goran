import {
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Query,
    UseGuards,
} from '@nestjs/common';
import { SessionStatus } from '../../../domain';
import { SessionsService } from '../../../application';
import { JwtAuthGuard } from '../../../../authentication';
import { ApiTags } from '@nestjs/swagger';

@Controller()
export class SessionsController {
    constructor(private readonly sessionsService: SessionsService) {}

    // TODO: [FEAT] security/sessions-authorization: Only return the sessions that the user has access to
    // TODO: [FEAT] security/sessions-errors
    @UseGuards(JwtAuthGuard)
    @ApiTags('users', 'sessions')
    @Get('/users/:id/sessions')
    getSessions(
        @Param('id') userId: string,
        @Query('status') status?: SessionStatus
    ) {
        this.sessionsService.getSessionsByUser(userId, status);
    }

    // TODO: [FEAT] security/authorization: Revoke only if the user has access to the session
    // TODO: [FEAT] security/sessions-errors
    @UseGuards(JwtAuthGuard)
    @Post('/sessions/:id/revoke')
    revokeSession(@Param('id') sessionId: string) {
        this.sessionsService.revokeSession(sessionId);
    }

    // TODO: [FEAT] security/authorization: Delete only if the user has access to the session
    // TODO: [FEAT] security/sessions-errors
    @UseGuards(JwtAuthGuard)
    @Delete('/sessions/:id')
    deleteSession(@Param('id') sessionId: string) {
        this.sessionsService.deleteSession(sessionId);
    }
}
