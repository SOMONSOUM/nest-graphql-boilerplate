import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class RefreshTokenInput {
  @Field(() => String, { name: 'refreshToken', nullable: false })
  @IsString()
  @IsNotEmpty()
  refreshToken: string;
}
