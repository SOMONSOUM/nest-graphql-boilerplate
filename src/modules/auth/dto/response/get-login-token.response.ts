import { Field, ObjectType } from '@nestjs/graphql';
import { BaseResponse } from '@/common/response';

@ObjectType()
export class GetLoginToken {
  @Field(() => String, { nullable: false })
  redirectUri: string;
}

@ObjectType()
export class GetLoginTokenResponse extends BaseResponse {
  @Field(() => GetLoginToken, { nullable: true })
  data: GetLoginToken | null;
}
