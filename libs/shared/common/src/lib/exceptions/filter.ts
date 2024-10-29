import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { ExceptionBase } from './exception.base';

@Catch(ExceptionBase)
export class DomainExceptionFilter implements ExceptionFilter {
    catch(exception: ExceptionBase, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const clientError = exception.toClientError();

        response.status(HttpStatus.EXPECTATION_FAILED).json({
            timestamp: new Date().toISOString(),
            code: clientError.code,
            message: clientError.message,
            success: clientError.success,
        });
    }
}
