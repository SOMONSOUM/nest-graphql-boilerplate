import { Field, ObjectType } from '@nestjs/graphql';
import { User } from '../../entity';
import { BaseResponse } from '@/common/response';

@ObjectType()
export class CreateUserResponse extends BaseResponse {
  @Field(() => User, { nullable: true })
  data?: User | null;
}
