import { AppService } from './app.service';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateUser, CreateUserResponse } from './create-user.dto';
import { UseInterceptors } from '@nestjs/common';
import { LoggingInterceptor } from './common/interceptor';
import { buildResponse } from './utils/response.util';

@Resolver()
export class AppResolver {
  constructor(private readonly appService: AppService) {}

  @Query(() => String)
  getHello(): string {
    return this.appService.getHello();
  }

  @UseInterceptors(LoggingInterceptor)
  @Mutation(() => CreateUserResponse)
  createUser(@Args('input') input: CreateUser) {
    const user = this.appService.createUser(
      input.email,
      input.password,
      input.favoriteColor,
    );

    return buildResponse({
      statusCode: 200,
      success: true,
      message: 'User created successfully',
      data: user,
    });
  }
}
