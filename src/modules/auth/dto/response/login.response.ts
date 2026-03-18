import { Field, ObjectType } from '@nestjs/graphql';
import { BaseResponse } from 'src/common/response';

@ObjectType()
export class Login {
  @Field(() => String, { nullable: false })
  redirectUri: string;
}

@ObjectType()
export class LoginResponse extends BaseResponse {
  @Field(() => Login, { nullable: true })
  data: Login | null;
}
