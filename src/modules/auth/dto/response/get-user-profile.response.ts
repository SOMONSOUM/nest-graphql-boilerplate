import { Field, Int, ObjectType } from '@nestjs/graphql';
import { BaseResponse } from '@/common/response';

@ObjectType()
export class UserProfile {
  @Field(() => Int, { nullable: false })
  id: number;

  @Field(() => String, { nullable: false })
  email: string;

  @Field(() => String, { nullable: true })
  username?: string;
}

@ObjectType()
export class UserProfileResponse extends BaseResponse {
  @Field(() => UserProfile, { nullable: true })
  data?: UserProfile | null;
}
