import {
  Field,
  InputType,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';
import { IsEmail, IsEnum, IsString, IsStrongPassword } from 'class-validator';
import { BaseResponse } from './common/response';

export enum AllowedColor {
  RED,
  GREEN,
  BLUE,
}

registerEnumType(AllowedColor, {
  name: 'AllowedColor',
});

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

  @Field(() => AllowedColor)
  @IsEnum(AllowedColor)
  favoriteColor: AllowedColor;
}

@ObjectType()
export class User {
  @Field(() => String, { name: 'email' })
  email: string;

  @Field(() => String, { name: 'password' })
  password: string;

  @Field(() => AllowedColor, { name: 'favoriteColor' })
  favoriteColor: AllowedColor;
}

@ObjectType()
export class CreateUserResponse extends BaseResponse {
  @Field(() => User)
  data!: User;
}
