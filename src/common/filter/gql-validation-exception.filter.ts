import { BadRequestException, Catch } from '@nestjs/common';
import { GqlExceptionFilter } from '@nestjs/graphql';
import { GraphQLError } from 'graphql';

/**
 * GqlValidationExceptionFilter is a custom exception filter for handling validation errors in GraphQL resolvers.
 * It catches BadRequestExceptions thrown by NestJS's validation pipe and formats them into a GraphQL-friendly error response.
 * The filter extracts validation error details and includes them in the GraphQL error extensions for better client-side error handling.
 * @Catch(BadRequestException)
 * @implements GqlExceptionFilter
 * @description
 * This filter is designed to work with GraphQL resolvers in a NestJS application. When a resolver throws a BadRequestException (typically due to validation failures), this filter intercepts the exception, extracts relevant information, and returns a GraphQLError with a structured message and additional details about the validation errors.
 * The filter looks for validation errors in the exception's response and includes them in the GraphQL error's extensions, allowing clients to easily identify and handle validation issues.
 * To use this filter, it should be registered globally in the AppModule or applied to specific resolvers where validation is expected.
 */
@Catch(BadRequestException)
export class GqlValidationExceptionFilter implements GqlExceptionFilter {
  catch(exception: BadRequestException) {
    // Extract the response from the exception, which may contain validation error details.
    const response = exception.getResponse() as {
      message?: string | string[];
      errors?: unknown[];
    };

    // Determine the error message to return. If the response contains a string message, use it; otherwise, use a default message.
    const message =
      typeof response?.message === 'string'
        ? response.message
        : 'Validation failed';

    return new GraphQLError(message, {
      extensions: {
        code: 'BAD_REQUEST',
        validationErrors: response?.errors ?? [],
      },
    });
  }
}
