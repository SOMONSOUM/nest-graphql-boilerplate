import {
  BadRequestException,
  ConflictException,
  HttpException,
  NotFoundException,
} from '@nestjs/common';
import { ValidationErrorItem } from 'src/common/response';

export interface GraphqlResponse<T> {
  statusCode: number;
  success: boolean;
  message?: string | null;
  timestamp: string;
  data: T | null;
  errors?: ValidationErrorItem[] | null;
}

export interface ErrorMappingOptions {
  defaultMessage: string;
  conflictField?: string;
}

/**
 * Create a consistent ISO timestamp for responses.
 *
 * @returns {string} ISO-8601 timestamp string.
 */
export function createTimestamp(): string {
  return new Date().toISOString();
}

/**
 * Build a response envelope with a consistent timestamp.
 *
 * @template T - Type of the response data.
 * @param {Omit<GraphqlResponse<T>, 'timestamp'> & { timestamp?: string }} payload - Response details.
 * @returns {GraphqlResponse<T>} Response payload with timestamp set.
 */
export function buildResponse<T>(
  payload: Omit<GraphqlResponse<T>, 'timestamp'> & { timestamp?: string },
): GraphqlResponse<T> {
  const { timestamp, ...rest } = payload;

  return {
    ...rest,
    timestamp: timestamp ?? createTimestamp(),
  };
}

/**
 * Map a NestJS HttpException into a response-friendly error payload.
 *
 * @param {unknown} error - Error thrown by a service or resolver.
 * @param {ErrorMappingOptions} options - Mapping options and defaults.
 * @returns {{ statusCode: number; message: string; errors?: ValidationErrorItem[] }}
 */
export function mapHttpException(
  error: unknown,
  options: ErrorMappingOptions,
): { statusCode: number; message: string; errors?: ValidationErrorItem[] } {
  if (error instanceof BadRequestException) {
    // Extract message and validation errors from the exception response
    const response = error.getResponse() as {
      message?: string | string[];
      errors?: ValidationErrorItem[];
    };

    // Determine the message to use in the response
    const message =
      typeof response?.message === 'string'
        ? response.message
        : options.defaultMessage;

    return {
      statusCode: error.getStatus(),
      message,
      errors: response?.errors ?? [],
    };
  }

  // Handle ConflictException with a single message only
  if (error instanceof ConflictException) {
    return {
      statusCode: error.getStatus(),
      message:
        typeof error.message === 'string'
          ? error.message
          : options.defaultMessage,
      errors: [],
    };
  }

  // Handle NotFoundException with a clear message
  if (error instanceof NotFoundException) {
    return {
      statusCode: error.getStatus(),
      message:
        typeof error.message === 'string'
          ? error.message
          : options.defaultMessage,
      errors: [],
    };
  }

  // For any other type of error, return a generic message with a 500 status code
  if (error instanceof HttpException) {
    return {
      statusCode: error.getStatus(),
      message:
        typeof error.message === 'string'
          ? error.message
          : options.defaultMessage,
      errors: [],
    };
  }

  return {
    statusCode: 500,
    message: options.defaultMessage,
    errors: [],
  };
}

/**
 * Execute an async operation with standardized response handling.
 *
 * @template T - Type of the response data.
 * @param {() => Promise<T>} action - Async operation to execute.
 * @param {{
 *   successMessage: string;
 *   successStatus?: number;
 *   onError?: (error: unknown) => { statusCode: number; message: string; errors?: ValidationErrorItem[] };
 * }} options - Success and error handling configuration.
 * @returns {Promise<GraphqlResponse<T>>} Response payload.
 */
export async function executeWithResponse<T>(
  action: () => Promise<T>,
  options: {
    successMessage: string;
    successStatus?: number;
    onError?: (error: unknown) => {
      statusCode: number;
      message: string;
      errors?: ValidationErrorItem[];
    };
  },
): Promise<GraphqlResponse<T>> {
  try {
    const data = await action();

    return buildResponse({
      statusCode: options.successStatus ?? 200,
      success: true,
      message: options.successMessage,
      data,
    });
  } catch (error) {
    const mapped = options.onError
      ? options.onError(error)
      : mapHttpException(error, { defaultMessage: 'Unexpected error' });

    return buildResponse<T>({
      statusCode: mapped.statusCode,
      success: false,
      message: mapped.message,
      errors: mapped.errors ?? [],
      data: null,
    });
  }
}
