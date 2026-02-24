import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('GraphQLInterceptor');

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const gqlCtx = GqlExecutionContext.create(context);
    const info = gqlCtx.getInfo();
    const args = gqlCtx.getArgs();

    this.logger.log(
      `➡️ ${info.parentType.name}.${info.fieldName} | args: ${JSON.stringify(args)}`,
    );

    const now = Date.now();

    return next
      .handle()
      .pipe(
        tap(() =>
          this.logger.log(
            `Completed ${info.fieldName} in ${Date.now() - now}ms`,
          ),
        ),
      );
  }
}
