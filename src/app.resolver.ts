import { IsEmail, IsString, IsStrongPassword } from 'class-validator';
import { AppService } from './app.service';
import {
  Args,
  Field,
  Mutation,
  ObjectType,
  Query,
  Resolver,
} from '@nestjs/graphql';
import { CreateUser, CreateUserResponse } from './create-user.dto';

@Resolver()
export class AppResolver {
  constructor(private readonly appService: AppService) {}

  @Query(() => String)
  getHello(): string {
    return this.appService.getHello();
  }

  @Mutation(() => CreateUserResponse)
  createUser(@Args('input') input: CreateUser) {
    return this.appService.createUser(input.email, input.password);
  }
}
