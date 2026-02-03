import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppResolver } from './app.resolver';
import { AppService } from './app.service';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { ConfigModule } from '@nestjs/config';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { formatGqlError } from './utils';
import { Request, Response } from 'express';
import databaseConfig from './database/database.config';
import { LoggerMiddleware } from './common/middlewares';
import { LoggerModule } from './common/logger/logger.module';
import { minutes, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { GraphQLThrottlerGuard } from './common/guard';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig],
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
      formatError: formatGqlError,
    }),
    LoggerModule,
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: minutes(1), // 1 minute
          limit: 10,
        },
      ],
    }),
  ],
  providers: [
    AppResolver,
    AppService,
    {
      provide: APP_GUARD,
      useClass: GraphQLThrottlerGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
