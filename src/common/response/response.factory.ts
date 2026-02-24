import { Type } from '@nestjs/common';
import { Field, ObjectType } from '@nestjs/graphql';
import { BaseResponse } from './base.response';

/**
 * Factory function to create a GraphQL response type for a given class reference.
 * This function generates a new GraphQL ObjectType that extends the BaseResponse and includes a data field of the specified type.
 * @template T - The type of the data field in the response.
 * @param {Type<T>} classRef - The class reference for the data type to be included in the response.
 * @returns {Type<GenericResponse>} A new GraphQL ObjectType that extends BaseResponse and includes a data field of type T.
 */
export function createResponseType<T>(classRef: Type<T>) {
  @ObjectType({ isAbstract: true })
  abstract class GenericResponse extends BaseResponse {
    @Field(() => classRef, { nullable: true })
    data!: T | null;
  }

  return GenericResponse;
}
