import { Field, InputType } from '@nestjs/graphql';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsStrongPassword,
} from 'class-validator';

@InputType()
export class CreateUserInput {
  @Field(() => String, { name: 'email', nullable: false })
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @Field(() => String, { name: 'username', nullable: true })
  @IsString()
  @IsOptional()
  username: string;

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
