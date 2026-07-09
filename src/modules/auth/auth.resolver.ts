import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import {
  CallBackResponse,
  UserProfile,
  UserProfileResponse,
  GetLoginTokenResponse,
  LogoutResponse,
  RefreshTokenResponse,
} from './dto/response';
import { buildResponse } from '@/utils/response.util';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from './guard/gql-auth.guard';
import { CurrentUser } from './decorator';
import {
  CallBackInput,
  GetLoginTokenInput,
  LoginInput,
  RefreshTokenInput,
} from './dto/input';
import { LoginResponse } from './dto/response/login.response';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => LoginResponse, { name: 'login' })
  async login(@Args('input') input: LoginInput) {
    const data = await this.authService.login(input);
    return buildResponse({
      statusCode: 200,
      success: true,
      message: 'Login successful',
      data,
    });
  }

  @Query(() => GetLoginTokenResponse, { name: 'getLoginToken' })
  async getLoginToken(@Args('input') input: GetLoginTokenInput) {
    const data = await this.authService.getLoginToken(input);
    return buildResponse({
      statusCode: 200,
      success: true,
      message: 'Get login token successful',
      data,
    });
  }

  @Query(() => CallBackResponse, { name: 'callBack' })
  async callBack(@Args('input') input: CallBackInput) {
    const data = await this.authService.callBack(
      input.code,
      input.codeVerifier,
    );
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
  @Query(() => UserProfileResponse, { name: 'getProfile' })
  async getProfile(
    @CurrentUser() user: UserProfile,
  ): Promise<UserProfileResponse> {
    return buildResponse({
      success: true,
      statusCode: 200,
      message: 'User profile fetched successfully',
      data: user,
    });
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => LogoutResponse, { name: 'logout' })
  async logout(@Args('refreshToken') refreshToken: string) {
    const data = await this.authService.logout(refreshToken);
    return buildResponse({
      statusCode: 200,
      success: true,
      message: 'Logout successful',
      data,
    });
  }
}
