import { GraphQLFormattedError } from 'graphql';
import { HttpStatus } from '@nestjs/common';

interface ErrorDetail {
  code: string;
  statusCode: number;
}

const errorMapping: Record<string, ErrorDetail> = {
  UNAUTHENTICATED: {
    code: 'UNAUTHENTICATED',
    statusCode: HttpStatus.UNAUTHORIZED,
  },
  UNAUTHORIZED: {
    code: 'UNAUTHORIZED',
    statusCode: HttpStatus.UNAUTHORIZED,
  },
  FORBIDDEN: { code: 'FORBIDDEN', statusCode: HttpStatus.FORBIDDEN },
  NOT_FOUND: { code: 'NOT_FOUND', statusCode: HttpStatus.NOT_FOUND },
  INTERNAL_SERVER_ERROR: {
    code: 'INTERNAL_SERVER_ERROR',
    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
  },
  BAD_REQUEST: { code: 'BAD_REQUEST', statusCode: HttpStatus.BAD_REQUEST },
  CONFLICT: { code: 'CONFLICT', statusCode: HttpStatus.CONFLICT },
  UNPROCESSABLE_ENTITY: {
    code: 'UNPROCESSABLE_ENTITY',
    statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
  },
  INVALID_CREDENTIALS: {
    code: 'INVALID_CREDENTIALS',
    statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
  },
  INVALID_INPUT: { code: 'INVALID_INPUT', statusCode: HttpStatus.BAD_REQUEST },
  NO_PHONE_NUMBER: {
    code: 'NO_PHONE_NUMBER',
    statusCode: HttpStatus.BAD_REQUEST,
  },
  TOO_MANY_REQUESTS: {
    code: 'TOO_MANY_REQUESTS',
    statusCode: HttpStatus.TOO_MANY_REQUESTS,
  },
  SERVICE_UNAVAILABLE: {
    code: 'SERVICE_UNAVAILABLE',
    statusCode: HttpStatus.SERVICE_UNAVAILABLE,
  },
  GATEWAY_TIMEOUT: {
    code: 'GATEWAY_TIMEOUT',
    statusCode: HttpStatus.GATEWAY_TIMEOUT,
  },
  BAD_GATEWAY: { code: 'BAD_GATEWAY', statusCode: HttpStatus.BAD_GATEWAY },
  REQUEST_TIMEOUT: {
    code: 'REQUEST_TIMEOUT',
    statusCode: HttpStatus.REQUEST_TIMEOUT,
  },
  METHOD_NOT_ALLOWED: {
    code: 'METHOD_NOT_ALLOWED',
    statusCode: HttpStatus.METHOD_NOT_ALLOWED,
  },
  NOT_ACCEPTABLE: {
    code: 'NOT_ACCEPTABLE',
    statusCode: HttpStatus.NOT_ACCEPTABLE,
  },
  UNSUPPORTED_MEDIA_TYPE: {
    code: 'UNSUPPORTED_MEDIA_TYPE',
    statusCode: HttpStatus.UNSUPPORTED_MEDIA_TYPE,
  },
  PRECONDITION_FAILED: {
    code: 'PRECONDITION_FAILED',
    statusCode: HttpStatus.PRECONDITION_FAILED,
  },
  EXPECTATION_FAILED: {
    code: 'EXPECTATION_FAILED',
    statusCode: HttpStatus.EXPECTATION_FAILED,
  },
  UNPROCESSABLE: { code: 'UNPROCESSABLE', statusCode: 422 },
  BAD_USER_INPUT: {
    code: 'BAD_REQUEST',
    statusCode: HttpStatus.BAD_REQUEST,
  },
  // Custom error code
  INVALID_RECIPIENT: {
    code: 'INVALID_RECIPIENT',
    statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
  },
  NOMSA_STATUS: {
    code: 'NOMSA_STATUS',
    statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
  },
  INVITED_USER: { code: 'INVITED_USER', statusCode: HttpStatus.CONFLICT },
};

export function errorHandler(err: GraphQLFormattedError) {
  const errorCode = (err.extensions?.code as string) || '';
  const errorDetail = errorMapping[errorCode];

  if (errorDetail) {
    return {
      message: err.message,
      code: errorDetail.code,
      statusCode: errorDetail.statusCode,
      stacktrace:
        process.env.NODE_ENV === 'local' ||
        process.env.NODE_ENV === 'development'
          ? err.extensions?.stacktrace
          : null,
    };
  }

  return {
    message: err.message,
    stacktrace:
      process.env.NODE_ENV === 'local' || process.env.NODE_ENV === 'development'
        ? err.extensions?.stacktrace
        : null,
    extensions: {
      code: 500,
    },
  };
}
