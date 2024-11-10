import { ApiException } from '@api/api.exception';
import { LoggerService } from '@app/shared/logger';
import {
    Catch,
    ArgumentsHost,
    HttpException,
    Inject,
    HttpStatus,
} from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Response } from 'express';
import { I18nService } from 'nestjs-i18n';

@Catch()
export class HttpExceptionFilter extends BaseExceptionFilter {
    i18n!: I18nService;
    logger!: LoggerService;
    catch(exception: HttpException, host: ArgumentsHost) {
        let message = '';
        if (exception instanceof ApiException) {
            const resp = exception.getResponse();
            const { i18nLang } = host.switchToHttp().getRequest();
            resp.message = this.i18n.translate(resp.message, {
                lang: i18nLang,
            });
            message = resp.message;
            if (exception.data) {
                Object.entries(exception.data).forEach(([key, value]) => {
                    resp.message = resp.message?.replace(`{{${key}}}`, value);
                });
            }
            resp.reasons.forEach((reason) => {
                reason.message = this.i18n.translate(reason.message, {
                    lang: i18nLang,
                });
                if (exception.data) {
                    Object.entries(exception.data).forEach(([key, value]) => {
                        reason.message = reason.message?.replace(`{{${key}}}`, value);
                    });
                }
            });
        }

        if (host.getType() === 'http') {
            const req = host.switchToHttp().getRequest();
            const res = host.switchToHttp().getResponse<Response>();
            const context = `${HttpExceptionFilter.name}-${req.correlationId}`;
            this.logger.error(exception.message, exception.stack, context);
            if (exception instanceof HttpException) {
                const status = exception.getStatus();
                res.status(status).json(exception.getResponse());
            } else {
                res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                    status: HttpStatus.INTERNAL_SERVER_ERROR,
                    message: 'Internal server error',
                });
            }
        } else {
            super.catch(exception, host);
        }

        // super.catch();
    }
}
