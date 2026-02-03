import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class RemoveResponse {
  @Field(() => Boolean, { nullable: false })
  ok: boolean;
}
