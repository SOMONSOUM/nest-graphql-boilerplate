import { Field, Int, ObjectType } from '@nestjs/graphql';
import { BaseResponse } from '@/common/response';

@ObjectType()
export class UserProfile {
  @Field(() => Int, { nullable: false })
  id: number;

  @Field(() => String, { nullable: false })
  email: string;

  @Field(() => String, { nullable: true })
  provider_id?: string;

  @Field(() => Boolean, { nullable: false })
  is_active: boolean;

  @Field(() => String, { nullable: true })
  profile_url?: string;

  @Field(() => String, { nullable: true })
  gender?: string;

  @Field(() => String, { nullable: true })
  phone_number?: string;

  @Field(() => String, { nullable: true })
  national_id?: string;

  @Field(() => String, { nullable: true })
  dob?: string;

  @Field(() => String, { nullable: true })
  full_name_km?: string;

  @Field(() => String, { nullable: true })
  full_name_en?: string;
}

@ObjectType()
export class UserProfileResponse extends BaseResponse {
  @Field(() => UserProfile, { nullable: true })
  data?: UserProfile | null;
}
