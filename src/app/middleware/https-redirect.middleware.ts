import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class HttpsRedirectMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    // Heroku sets `x-forwarded-proto` header to "http" or "https"
    if (req.headers['x-forwarded-proto'] !== 'https') {
      // Redirect to the same URL but with HTTPS
      return res.redirect(`https://${req.headers.host}${req.url}`);
    }
    next();
  }
}