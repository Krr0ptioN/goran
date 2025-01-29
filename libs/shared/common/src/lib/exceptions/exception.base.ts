import { SystemScope } from '../scope';

export interface SerializedException {
    message: string;
    code: string;
    stack?: string;
    scope?: SystemScope;
    cause?: string;
    /**
     * ^ Consider adding optional `metadata` object to
     * exceptions (if language doesn't support anything
     * similar by default) and pass some useful technical
     * information about the exception when throwing.
     * This will make debugging easier.
     */
    metadata?: unknown;
    /**
     * Success is indication of whether the operation succeed,
     * or not. Since some errors can be invoked despite the fact
     * the operation successfuly completed.
     */
    success: boolean;
}

/**
 * Base class for custom exceptions.
 *
 * @abstract
 * @class ExceptionBase
 * @extends {Error}
 */
export abstract class ExceptionBase extends Error {
    abstract code: string;
    scope?: SystemScope;

    /**
     * @param {string} message
     * @param {ObjectLiteral} [metadata={}]
     * **BE CAREFUL** not to include sensitive info in 'metadata'
     * to prevent leaks since all exception's data will end up
     * in application's log files. Only include non-sensitive
     * info that may help with debugging.
     */
    constructor(
        override readonly message: string,
        readonly cause?: Error,
        readonly metadata?: unknown
    ) {
        super(message);
        Error.captureStackTrace(this, this.constructor);
    }

    toJSON(): SerializedException {
        return {
            message: this.message,
            code: this.code,
            stack: this.stack,
            scope: this.scope,
            success: false,
            cause: JSON.stringify(this.cause),
            metadata: this.metadata,
        };
    }

    toClientError(): SerializedException {
        return {
            message: this.message,
            code: this.code,
            success: false,
        };
    }
}
