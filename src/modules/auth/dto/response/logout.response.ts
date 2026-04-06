import { Field, ObjectType } from '@nestjs/graphql';
import { BaseResponse } from 'src/common/response';

@ObjectType()
export class Logout {
  @Field(() => Boolean, { defaultValue: false })
  success: boolean;
}

@ObjectType()
export class LogoutResponse extends BaseResponse {
  @Field(() => Logout, { nullable: true })
  data: Logout | null;
}
