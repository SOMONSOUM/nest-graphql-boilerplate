import { Field, Int, ObjectType } from '@nestjs/graphql';

/**
 * BaseResponse is an abstract GraphQL ObjectType that serves as a common structure for API responses.
 * It includes standard fields such as statusCode, success, message, and timestamp.
 * This class can be extended by specific response types to include additional data fields.
 */
@ObjectType({ isAbstract: true })
export abstract class BaseResponse {
  @Field(() => Int)
  // HTTP status code of the response, e.g., 200 for success, 400 for bad request, etc.
  statusCode!: number;

  // Indicates whether the operation was successful or not.
  @Field(() => Boolean)
  success!: boolean;

  // Optional message providing additional information about the response, such as error details or success messages.
  @Field(() => String, { nullable: true })
  message?: string | null;

  // Timestamp indicating when the response was generated, formatted as an ISO string.
  @Field(() => String)
  timestamp!: string;
}

/**
 * ValidationErrorItem is a GraphQL ObjectType that represents a single validation error for a specific field.
 * It includes the name of the field that failed validation and an array of error messages associated with that field.
 * This type can be used in response types to provide detailed information about validation errors that occurred during input processing.
 */
@ObjectType()
export class ValidationErrorItem {
  @Field(() => String)
  field!: string;

  @Field(() => [String])
  messages!: string[];
}
