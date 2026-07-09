import {
  CanActivate,
  ExecutionContext,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../decorator';
import { UserProfile } from '../dto/response';
import { OAuthClientService } from '@/shared/oauth/client.service';
import { GraphQLError } from 'graphql/error';

declare global {
  namespace Express {
    interface Request {
      user: UserProfile | null;
    }
  }
}

@Injectable()
export class GqlAuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly clientService: OAuthClientService,
  ) {}

  private getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext().req;
  }

  async canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const req = this.getRequest(context);
    const authorization = req.headers?.authorization;
    const accessToken =
      typeof authorization === 'string' &&
      authorization.toLowerCase().startsWith('bearer ')
        ? authorization.slice(7).trim()
        : null;

    if (!accessToken) {
      throw new GraphQLError('Missing bearer token', {
        extensions: {
          code: HttpStatus.UNAUTHORIZED,
        },
      });
    }

    const { data, error } = await this.clientService.getProfile(accessToken);

    if (error || !data?.isActive) {
      throw new GraphQLError(error?.message ?? 'Unauthorized access', {
        extensions: {
          code: error?.code ?? HttpStatus.UNAUTHORIZED,
        },
      });
    }

    req.user = data;
    return true;
  }
}
