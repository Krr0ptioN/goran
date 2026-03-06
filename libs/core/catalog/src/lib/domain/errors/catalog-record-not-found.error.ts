import { ExceptionBase } from '@goran/common';

export class CatalogRecordNotFoundError extends ExceptionBase {
    readonly code: string;

    constructor(
        readonly resource: string,
        readonly resourceId: string,
        cause?: Error,
        metadata?: unknown,
    ) {
        super(`${resource} not found`, cause, metadata);
        this.code = `CATALOG.${resource.toUpperCase()}.NOT_FOUND`;
    }
}
