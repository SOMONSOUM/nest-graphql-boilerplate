import { Injectable } from '@nestjs/common';
import { GraphQLError } from 'graphql/error';
import {
  type ApiResponse,
  type LoginTokenResponse,
  type ValidateAuthorizationCodeResponse,
  type RefreshTokenResponse,
  type LookupUserProfileResponse,
  type GetLoginTokenInput,
  type ValidateAuthorizationCodeInput,
  MOCOAuthClient,
} from 'moc-oauth-client';

export const oauth = new MOCOAuthClient();

@Injectable()
export class OAuthClientService {
  async getLoginToken(
    input: GetLoginTokenInput,
  ): Promise<ApiResponse<LoginTokenResponse>> {
    return await oauth.getLoginToken(input);
  }

  async validateAuthorizationCode(
    input: ValidateAuthorizationCodeInput,
  ): Promise<ApiResponse<ValidateAuthorizationCodeResponse>> {
    return await oauth.validateAuthorizationCode(input);
  }

  async logout(refreshToken: string): Promise<ApiResponse<boolean>> {
    return await oauth.logout(refreshToken);
  }

  async refreshToken(
    refreshToken: string,
  ): Promise<ApiResponse<RefreshTokenResponse>> {
    return await oauth.refreshToken(refreshToken);
  }

  async getProfile(
    accessToken: string,
  ): Promise<ApiResponse<LookupUserProfileResponse>> {
    try {
      return await oauth.lookupUserProfile(accessToken);
    } catch (error) {
      if (error instanceof GraphQLError) throw error;
      throw new GraphQLError('Failed to lookup user profile', {
        extensions: {
          code: 'UNAUTHORIZED',
        },
      });
    }
  }
}
