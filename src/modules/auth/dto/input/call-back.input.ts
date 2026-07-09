import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class CallBackInput {
  @Field(() => String, { name: 'code', nullable: false })
  @IsString()
  @IsNotEmpty()
  code: string;

  @Field(() => String, { name: 'codeVerifier', nullable: false })
  @IsString()
  @IsNotEmpty()
  codeVerifier: string;
}
