import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
    StreamableFile,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable, map } from 'rxjs';
import { I18nService } from 'nestjs-i18n';
import { HTTP_CODE_METADATA } from '@nestjs/common/constants';
import { IMessage, SUCCESS_MSG } from '@app/decorators/message.decorator';

@Injectable()
export class TransformInterceptor implements NestInterceptor<any> {
    constructor(private $reflector: Reflector, private i18n: I18nService) { }
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        return next.handle().pipe(
            map((result) => {
                if (result instanceof StreamableFile) {
                    return result;
                }
                let MSG_CODE = this.$reflector.get<IMessage>(
                    SUCCESS_MSG,
                    context.getHandler(),
                );
                const statusCode =
                    this.$reflector.get<number>(
                        HTTP_CODE_METADATA,
                        context.getHandler(),
                    ) ?? 200;
                context.switchToHttp().getResponse().status(statusCode);
                let message = 'Success';
                if (MSG_CODE) {
                    if (typeof MSG_CODE === 'function') {
                        MSG_CODE = MSG_CODE(context.switchToHttp().getRequest(), result);
                    }
                    const { i18nLang } = context.switchToHttp().getRequest();
                    const msg = this.i18n.translate(MSG_CODE as string, {
                        lang: i18nLang,
                    }) as string;
                    if (msg) {
                        message = msg;
                    }
                }
                return { status: statusCode, message, result };
            }),
        );
    }
}
