import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { UserService } from './user.service';
import { CreateUserInput } from './dto/input';
import { CreateUserResponse } from './dto/response';
import { buildResponse } from '@/utils/response.util';
import { HttpStatus } from '@nestjs/common';

@Resolver()
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Mutation(() => CreateUserResponse)
  async registerUser(
    @Args('input') input: CreateUserInput,
  ): Promise<CreateUserResponse> {
    const data = await this.userService.registerUser(input);
    return buildResponse({
      success: true,
      message: 'User created successfully',
      statusCode: HttpStatus.OK,
      data,
    });
  }
}
