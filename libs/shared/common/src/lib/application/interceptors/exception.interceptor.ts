import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ExceptionBase } from '../../exceptions';
import { ApiErrorResponse } from '../../api';
import { BadRequestException, CallHandler, ExecutionContext, Logger, NestInterceptor } from '@nestjs/common';

export class ExceptionInterceptor implements NestInterceptor {
    private readonly logger: Logger = new Logger(ExceptionInterceptor.name);

    intercept(
        _context: ExecutionContext,
        next: CallHandler
    ): Observable<ExceptionBase> {
        return next.handle().pipe(
            catchError((err) => {
                if (err.status >= 400 && err.status < 500) {
                    this.logger.debug(err.message);

                    const isClassValidatorError =
                        Array.isArray(err?.response?.message) &&
                        typeof err?.response?.error === 'string' &&
                        err.status === 400;
                    if (isClassValidatorError) {
                        err = new BadRequestException(
                            new ApiErrorResponse({
                                statusCode: err.status,
                                message: 'Validation error',
                                error: err?.response?.error,
                                subErrors: err?.response?.message,
                            })
                        );
                    }
                }

                return throwError(err);
            })
        );
    }
}
