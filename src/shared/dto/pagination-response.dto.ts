import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class PaginationResponse {
  @Field(() => Int)
  totalItems: number;

  @Field(() => Int)
  currentPage: number;

  @Field(() => Int)
  totalPage: number;

  @Field(() => Int)
  pageSize: number;

  @Field(() => Boolean)
  hasPreviousPage: boolean;

  @Field(() => Boolean)
  hasNextPage: boolean;
}
