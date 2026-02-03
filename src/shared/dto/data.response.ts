import { Field, Int, ObjectType } from '@nestjs/graphql';

export function GenericResponse<T>(dataType: () => any) {
  @ObjectType({ isAbstract: true })
  abstract class DataResponse {
    @Field(() => Int)
    error: number;

    @Field(() => String)
    message: string;

    @Field(() => Boolean)
    success: boolean;

    @Field(dataType, { nullable: true })
    data?: T;
  }
  return DataResponse;
}
