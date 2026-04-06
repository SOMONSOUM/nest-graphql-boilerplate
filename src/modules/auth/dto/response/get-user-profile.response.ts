import { Field, Int, ObjectType } from '@nestjs/graphql';
import { BaseResponse } from 'src/common/response';

@ObjectType()
export class GetUserProfile {
  @Field(() => Int, { nullable: false })
  userId: number;

  @Field(() => String, { nullable: false })
  email: string;

  @Field(() => String, { nullable: true })
  username?: string;

  @Field(() => Boolean, { nullable: false })
  isActive: boolean;
}

@ObjectType()
export class GetUserProfileResponse extends BaseResponse {
  @Field(() => GetUserProfile, { nullable: true })
  data?: GetUserProfile | null;
}
