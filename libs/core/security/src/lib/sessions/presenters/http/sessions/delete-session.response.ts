import { ResponseBase } from '@goran/common';

export class DeleteSessionSuccessResponse extends ResponseBase {
    constructor() {
        super({
            message: 'Session deleted successfully',
            success: true,
            code: 'SESSION_DELETED',
        });
    }
}
