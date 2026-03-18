import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { map, Observable } from 'rxjs';

export interface Response<T> {
  statusCode: number;
  success: boolean;
  data: T;
  timestamp: string;
}

@Injectable()
export class TransformResponseInterceptor<T> implements NestInterceptor<
  T,
  Response<T>
> {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    const ctx = GqlExecutionContext.create(context);
    return next.handle().pipe(
      map((data) => ({
        success: true,
        statusCode: ctx.getContext().res.statusCode,
        data,
        timestamp: new Date().toISOString(),
      })),
    );
  }
}
