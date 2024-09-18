import { ResponseBase } from '@goran/common';
import { SessionDto } from '../../../application';

interface SessionResponseProps {
    sessions: SessionDto[];
}

export class GetSessionsSuccessResponse extends ResponseBase<SessionResponseProps> {
    constructor(props: SessionResponseProps) {
        super({
            data: props,
            message: 'Sessions retrieved successfully',
            success: true,
            code: 'SESSIONS_RETRIEVED',
        });
    }
}
