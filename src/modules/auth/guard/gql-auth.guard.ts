import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { GraphQLError } from 'graphql/error';
import { AuthService } from '../auth.service';
import { Request } from 'express';
import { IS_PUBLIC_KEY } from '../decorator/public.decorator';
import { Reflector } from '@nestjs/core';
import { TokenService } from '@/common/token/token.service';
import { UserRepository } from '@/modules/user/repository';
import { UserProfile } from '../dto/response';

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
    private reflector: Reflector,
    private readonly tokenService: TokenService,
    private readonly userRepository: UserRepository,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const ctx = GqlExecutionContext.create(context);
    const { req } = ctx.getContext<{ req: Request }>();

    if (!req) {
      throw new GraphQLError('Request object not found in context', {
        extensions: { code: 'INTERNAL_SERVER_ERROR' },
      });
    }

    const authHeader = req.headers?.authorization || req.headers?.Authorization;

    if (!authHeader || typeof authHeader !== 'string') {
      throw new GraphQLError('Authorization header is missing', {
        extensions: { code: 'UNAUTHORIZED' },
      });
    }

    const [type, token] = authHeader.split(' ');

    if (type !== 'Bearer' || !token) {
      throw new GraphQLError('Invalid authorization header format', {
        extensions: {
          code: 'UNAUTHORIZED',
        },
      });
    }

    try {
      const payload = await this.tokenService.verifyAccessToken(token);
      const user = await this.userRepository.findOne({
        where: {
          id: payload?.sub,
        },
      });

      if (!user) {
        throw new GraphQLError('User not found', {
          extensions: {
            code: 'UNAUTHORIZED',
          },
        });
      }

      req.user = user;
      return true;
    } catch (error) {
      if (error instanceof GraphQLError) {
        throw error;
      }
      throw new GraphQLError('Unauthorized Access', {
        extensions: {
          code: 'UNAUTHORIZED',
        },
      });
    }
  }
}
