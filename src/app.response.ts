import { CallHandler, ExecutionContext, HttpException, HttpStatus, Injectable, NestInterceptor, SetMetadata } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { format } from 'date-fns';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

export type Response<T> = {
    statusCode: number;
    path: string;
    message: string;
    data: T;
    timestamp: string;
};

const RESPONSE_MESSAGE_METADATA = 'responseMessage';
export const ResponseMessage = (message: string) => SetMetadata(RESPONSE_MESSAGE_METADATA, message);

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, Response<T>> {

    constructor(private reflector: Reflector) { }

    intercept(context: ExecutionContext, next: CallHandler): Observable<Response<T>> {
        return next.handle().pipe(
            map((response: unknown) => this.responseHandler(response, context)),
            catchError((error: HttpException) => throwError(() => this.errorHandler(error, context))),
        );
    }

    errorHandler(exception: HttpException, context: ExecutionContext) {
        const _context = context.switchToHttp();
        const response = _context.getResponse();
        const request = _context.getRequest();

        const status =
            exception instanceof HttpException
                ? exception.getStatus()
                : HttpStatus.INTERNAL_SERVER_ERROR;

        response.status(status).json({
            message: exception.message,
            path: request.url,
            result: exception,
            statusCode: status,
            timestamp: format(new Date().toISOString(), 'yyyy-MM-dd HH:mm:ss'),
        });

    }

    responseHandler(response: any, context: ExecutionContext) {
        const _context = context.switchToHttp();
        const _response = _context.getResponse();
        const request = _context.getRequest();
        const statusCode = _response.statusCode;
        const message = this.reflector.get<string>(RESPONSE_MESSAGE_METADATA, context.getHandler()) || 'success';

        return {
            data: response,
            message,
            path: request.url,
            statusCode,
            timestamp: format(new Date().toISOString(), 'yyyy-MM-dd HH:mm:ss')
        };
    }

};

export function CustomResponse({ data, message, path, statusCode }: ICustomResponse) {
    return {
        data,
        message,
        path,
        statusCode,
        timestamp: format(new Date().toISOString(), 'yyyy-MM-dd HH:mm:ss')
    };
};

interface ICustomResponse { data: any, message: string, path: string, statusCode: HttpStatus, timestamp?: string; }
