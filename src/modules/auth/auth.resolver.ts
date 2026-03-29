import { Args, Query, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import {
  CallBackResponse,
  GetUserProfile,
  GetUserProfileResponse,
  LoginResponse,
  RefreshTokenResponse,
} from './dto/response';
import { buildResponse } from 'src/utils/response.util';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from './guard/gql-auth.guard';
import { CurrentUser } from './decorator';
import { CallBackInput, RefreshTokenInput } from './dto/input';

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

  @Query(() => CallBackResponse, { name: 'callBack' })
  async callBack(@Args('input') input: CallBackInput) {
    const data = await this.authService.callBack(input.code);
    return buildResponse({
      statusCode: 200,
      success: true,
      message: 'Callback successful',
      data,
    });
  }

  @Query(() => RefreshTokenResponse, { name: 'refreshToken' })
  async refreshToken(@Args('input') input: RefreshTokenInput) {
    const data = await this.authService.refreshToken(input.refreshToken);
    return buildResponse({
      statusCode: 200,
      success: true,
      message: 'Refresh token successful',
      data,
    });
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => GetUserProfileResponse, { name: 'getProfile' })
  async getProfile(
    @CurrentUser() user: GetUserProfile,
  ): Promise<GetUserProfileResponse> {
    return buildResponse({
      statusCode: 200,
      success: true,
      message: 'User profile fetched successfully',
      data: user,
    });
  }
}
