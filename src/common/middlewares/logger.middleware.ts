import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { CustomLogger } from '../logger/custom-logger.service';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(private readonly logger: CustomLogger) {}

  use(req: Request, res: Response, next: NextFunction) {
    const start = Date.now();
    const { method, originalUrl, query, body, headers } = req;

    res.on('finish', () => {
      const duration = Date.now() - start;
      if (body?.operationName !== 'IntrospectionQuery') {
        this.logger.log({
          message: `Completed request: ${method} ${originalUrl} in ${duration}ms`,
          data: {
            query,
            body,
            headers,
            method,
            url: originalUrl,
            duration: `${duration}ms`,
          },
        });
      }
    });

    next();
  }
}
