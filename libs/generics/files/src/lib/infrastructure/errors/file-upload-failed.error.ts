import { ExceptionBase } from '@goran/common';

export class FileUploadFailedInfra extends ExceptionBase {
    static readonly message = 'File upload failed';
    public readonly scope = 'infrastructure';
    public readonly code = 'FILES.UPLOAD_FAILED';

    constructor(cause?: Error, metadata?: unknown) {
        super(FileUploadFailedInfra.message, cause, metadata);
    }
}
