import { LoggerService } from '@app/shared/logger';
import {
    CallHandler,
    ExecutionContext,
    Injectable,
    NestInterceptor,
    Scope,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { v4 as uuid } from 'uuid';

@Injectable()
export class CorrelationInterceptor implements NestInterceptor {
    logger!: LoggerService;
    intercept(
        context: ExecutionContext,
        next: CallHandler<any>,
    ): Observable<any> | Promise<Observable<any>> {
        const id = uuid();
        this.logger.setCorrelationId(id);
        if (context.getType() === 'http') {
            const ctx = context.switchToHttp();
            const req = ctx.getRequest();
            req.correlationId = id;
            this.logger.request(ctx.getRequest(), ctx.getResponse(), id);
        }
        return next.handle();
    }
}
