import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class GetUserProfileInput {
  @Field(() => String, { name: 'accessToken', nullable: false })
  @IsString()
  @IsNotEmpty()
  accessToken: string;
}
