import { Field, InputType } from '@nestjs/graphql';
import { IsIn, IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class GetLoginTokenInput {
  @Field(() => String, { nullable: false })
  @IsString()
  @IsNotEmpty()
  state: string;

  @Field(() => String, { nullable: false })
  @IsString()
  @IsNotEmpty()
  codeChallenge: string;

  @Field(() => String, { nullable: true, defaultValue: 'S256' })
  @IsIn(['S256'])
  codeChallengeMethod: 'S256' = 'S256';
}
