import { ResponseBase } from '@goran/common';

export class RevokedSessionSuccessResponse extends ResponseBase {
    constructor() {
        super({
            message: 'Session revoked successfully',
            success: true,
            code: 'SESSION_REVOKED',
        });
    }
}
