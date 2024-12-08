import { LoggerService } from '@app/shared/logger';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import * as newrelic from 'newrelic';

@Injectable()
export class NewrelicMiddleware implements NestMiddleware {
    use(req: Request, res: any, next: NextFunction) {
        const path = req.path;
        if (path !== '/') {
            const generalizedPath = path.replace(/\b(?:[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}|google_[A-Za-z0-9_-]+)\b/, '*');
            newrelic.setTransactionName(`${req.method} ${generalizedPath}`);
        }
        next();
    }
}
