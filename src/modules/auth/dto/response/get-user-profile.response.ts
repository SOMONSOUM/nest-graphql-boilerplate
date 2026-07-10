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

  @Field(() => Boolean, { nullable: false })
  isActive: boolean;

  @Field(() => String, { nullable: true })
  profileUrl?: string;

  @Field(() => String, { nullable: true })
  gender?: string;

  @Field(() => String, { nullable: true })
  phoneNumber?: string;

  @Field(() => String, { nullable: true })
  nationalId?: string;

  @Field(() => String, { nullable: true })
  dob?: string;

  @Field(() => String, { nullable: true })
  fullNameKm?: string;

  @Field(() => String, { nullable: true })
  fullNameEn?: string;
}

@ObjectType()
export class UserProfileResponse extends BaseResponse {
  @Field(() => UserProfile, { nullable: true })
  data?: UserProfile | null;
}
