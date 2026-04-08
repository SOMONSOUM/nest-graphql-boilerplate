import { Injectable } from '@nestjs/common';
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
    return await oauth.lookupUserProfile(accessToken);
  }
}
