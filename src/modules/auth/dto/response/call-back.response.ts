import { Field, Int, ObjectType } from '@nestjs/graphql';
import { BaseResponse } from 'src/common/response';

@ObjectType()
export class CallBack {
  @Field(() => String, { nullable: true })
  accessToken?: string;

  @Field(() => String, { nullable: true })
  refreshToken?: string;
}

@ObjectType()
export class CallBackResponse extends BaseResponse {
  @Field(() => CallBack, { nullable: true })
  data?: CallBackResponse | null;
}
