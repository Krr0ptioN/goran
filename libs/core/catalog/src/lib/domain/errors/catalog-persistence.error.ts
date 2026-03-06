import { ExceptionBase } from '@goran/common';

export class CatalogPersistenceError extends ExceptionBase {
    readonly code: string;

    constructor(
        readonly resource: string,
        readonly operation: string,
        cause?: Error,
        metadata?: unknown,
    ) {
        super(`Failed to ${operation} ${resource}`, cause, metadata);
        this.code = `CATALOG.${resource.toUpperCase()}.${operation.toUpperCase()}_FAILED`;
    }
}
