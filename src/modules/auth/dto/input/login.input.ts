import { Field, InputType } from '@nestjs/graphql';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
} from 'class-validator';

@InputType()
export class LoginInput {
  @Field(() => String, { name: 'email', nullable: false })
  @IsEmail()
  @IsString()
  @IsNotEmpty()
  email: string;

  @Field(() => String, { name: 'password', nullable: false })
  @IsString()
  @IsNotEmpty()
  @IsStrongPassword({
    minLength: 6,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1,
  })
  password: string;
}
