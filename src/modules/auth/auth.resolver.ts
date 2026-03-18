import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { GetUserProfileResponse, LoginResponse } from './dto/response';
import { buildResponse } from 'src/utils/response.util';
import { GetUserProfileInput } from './dto/input';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Query(() => LoginResponse, { name: 'login' })
  async login() {
    const data = await this.authService.login();
    return buildResponse({
      statusCode: 200,
      success: true,
      message: 'Login successful',
      data,
    });
  }

  @Mutation(() => GetUserProfileResponse, { name: 'getProfile' })
  async getProfile(
    @Args('input') input: GetUserProfileInput,
  ): Promise<GetUserProfileResponse> {
    return buildResponse({
      statusCode: 200,
      success: true,
      message: 'User profile fetched successfully',
      data: await this.authService.getCurrentUser(input.accessToken),
    });
  }
}
