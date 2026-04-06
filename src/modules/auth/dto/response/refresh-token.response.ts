import { Field, Int, ObjectType } from '@nestjs/graphql';
import { BaseResponse } from 'src/common/response';

@ObjectType()
export class ResfreshToken {
  @Field(() => String, { nullable: true })
  accessToken?: string;

  @Field(() => String, { nullable: true })
  refreshToken?: string;
}

@ObjectType()
export class RefreshTokenResponse extends BaseResponse {
  @Field(() => ResfreshToken, { nullable: true })
  data?: ResfreshToken | null;
}
