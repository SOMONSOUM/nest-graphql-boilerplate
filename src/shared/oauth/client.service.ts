import { Injectable } from '@nestjs/common';
import { GraphQLError } from 'graphql/error';
import {
  type ApiResponse,
  type LoginTokenResponse,
  type ValidateAuthorizationCodeResponse,
  type RefreshTokenResponse,
  type LookupUserProfileResponse,
  MOCOAuthClient,
} from 'moc-oauth-client';

export const oauth = new MOCOAuthClient();

@Injectable()
export class OAuthClientService {
  async getLoginToken(): Promise<ApiResponse<LoginTokenResponse>> {
    return await oauth.getLoginToken();
  }

  async validateAuthorizationCode(
    code: string,
  ): Promise<ApiResponse<ValidateAuthorizationCodeResponse>> {
    return await oauth.validateAuthorizationCode(code);
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
