import { BaseResponse } from '@/common/response';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Login {
  @Field(() => String, { nullable: false, name: 'accessToken' })
  accessToken: string;

  @Field(() => String, { nullable: false, name: 'refreshToken' })
  refreshToken: string;
}

@ObjectType()
export class LoginResponse extends BaseResponse {
  @Field(() => Login, { nullable: true, name: 'login' })
  data: Login | null;
}
