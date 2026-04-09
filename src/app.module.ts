import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppResolver } from './app.resolver';
import { AppService } from './app.service';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { ConfigModule } from '@nestjs/config';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { Request, Response } from 'express';
import { LoggerMiddleware } from './common/middlewares';
import { LoggerModule } from './common/logger/logger.module';
import { minutes, seconds, ThrottlerModule } from '@nestjs/throttler';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { GraphQLThrottlerGuard } from './common/guard';
import { GraphQLFormattedError } from 'graphql';
import { GqlValidationExceptionFilter } from './common/filter';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { DatabaseModule } from './database/database.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    JwtModule.register({
      global: true,
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      playground: false,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      plugins: [ApolloServerPluginLandingPageLocalDefault({ footer: false })],
      context: ({ req, res }: { req: Request; res: Response }) => ({
        req,
        res,
      }),
      csrfPrevention: true,
      persistedQueries: {
        ttl: 900,
      },
      formatError: (error: GraphQLFormattedError) => {
        const validationErrors =
          (error.extensions as { validationErrors?: unknown[] } | undefined)
            ?.validationErrors ??
          (
            error.extensions as
              | { originalError?: { response?: { errors?: unknown[] } } }
              | undefined
          )?.originalError?.response?.errors;

        if (validationErrors && validationErrors.length > 0) {
          return {
            statusCode: 409,
            success: false,
            timestamp: new Date().toISOString(),
            message: 'Validation failed',
            errors: validationErrors,
          };
        }

        return error;
      },
    }),
    LoggerModule,
    ThrottlerModule.forRoot({
      throttlers: [
        {
          name: 'short',
          ttl: seconds(1), // 1 second
          limit: 3, // 3 requests
        },
        {
          name: 'medium',
          ttl: seconds(10), // 10 seconds
          limit: 20, // 20 requests
        },
        {
          name: 'long',
          ttl: minutes(1), // 1 minute
          limit: 100, // 100 requests
        },
      ],
    }),
    DatabaseModule,
    AuthModule,
    UserModule,
  ],
  providers: [
    AppResolver,
    AppService,
    {
      provide: APP_GUARD,
      useClass: GraphQLThrottlerGuard,
    },
    {
      provide: APP_FILTER,
      useClass: GqlValidationExceptionFilter,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
