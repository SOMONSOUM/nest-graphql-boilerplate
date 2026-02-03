import { HttpStatus } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { type GraphQLError, type GraphQLFormattedError } from 'graphql';

ConfigModule.forRoot({
  isGlobal: true,
  envFilePath: '.env',
});

const configService = new ConfigService();
const isProduction =
  configService.getOrThrow<'development' | 'testing' | 'production'>(
    'NODE_ENV',
  ) === 'production';

export function formatGqlError(error: GraphQLError): GraphQLFormattedError {
  const { message, extensions } = error;
  const originalError = extensions?.originalError as Record<
    string,
    string | number
  >;

  if (isProduction) {
    return {
      message,
      extensions: {
        code: error.extensions?.code,
      },
    };
  } else {
    return {
      ...error,
      extensions: originalError
        ? {
            code: originalError.statusCode,
            error: HttpStatus[originalError.statusCode],
            details: originalError.details,
          }
        : extensions,
    };
  }
}
