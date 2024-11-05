import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { LoggerService } from '@app/shared/logger';
import { v4 as uuid } from 'uuid';

@Injectable()
export class RequestMiddleware implements NestMiddleware {
    constructor(public logger: LoggerService) { }
    use(req: any, res: Response, next: NextFunction) {
        const id = uuid();
        this.logger.setCorrelationId(id);
        req.correlationId = id;
        this.logger.request(req, res, id);
        next();
    }
}
