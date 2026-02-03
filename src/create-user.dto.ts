import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsEmail, IsString, IsStrongPassword } from 'class-validator';

@InputType()
export class CreateUser {
  @Field(() => String, { name: 'email' })
  @IsEmail()
  @IsString()
  email: string;

  @Field(() => String, { name: 'password' })
  @IsString()
  @IsStrongPassword({
    minLength: 6,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1,
  })
  password: string;
}

@ObjectType()
export class CreateUserResponse {
  @Field(() => String, { name: 'email' })
  email: string;

  @Field(() => String, { name: 'password' })
  password: string;
}
