import { Injectable } from '@nestjs/common';
import { GraphQLError } from 'graphql';
import { oauth } from 'src/shared/oauth/client';

@Injectable()
export class AuthService {
  constructor() {}

  async login() {
    const { data, error } = await oauth.getLoginToken();

    if (!data || error) {
      throw new GraphQLError(error?.message ?? 'Invalid client credentials', {
        extensions: {
          code: error?.code ?? 'INVALID_CLIENT_CREDENTIALS',
        },
      });
    }

    return {
      ...data,
    };
  }

  async callBack(code: string) {
    const { data, error } = await oauth.validateAuthorizationCode(code);
    if (error) {
      throw new GraphQLError(error.message, {
        extensions: {
          code: error.code,
        },
      });
    }

    if (!data?.payload || !data.isValid) {
      throw new GraphQLError(
        'Failed to exchange authorization code for tokens',
        {
          extensions: {
            code: 'TOKEN_EXCHANGE_FAILED',
          },
        },
      );
    }

    return {
      accessToken: data?.payload?.accessToken,
      refreshToken: data?.payload?.refreshToken,
    };
  }

  async refreshToken(refreshToken: string) {
    const { data, error } = await oauth.refreshToken(refreshToken);
    if (error) {
      throw new GraphQLError(error.message, {
        extensions: {
          code: error.code,
        },
      });
    }

    if (!data) {
      throw new GraphQLError('Failed to refresh access token', {
        extensions: {
          code: 'TOKEN_REFRESH_FAILED',
        },
      });
    }

    return {
      accessToken: data?.accessToken,
      refreshToken: data?.refreshToken,
    };
  }

  async getCurrentUser(accessToken: string) {
    const { data, error } = await oauth.lookupUserProfile(accessToken);
    if (error) {
      throw new GraphQLError(error.message, {
        extensions: {
          code: error.code,
        },
      });
    }

    if (!data) {
      throw new GraphQLError('User not found', {
        extensions: {
          code: 'USER_NOT_FOUND',
        },
      });
    }

    return {
      userId: data?.id,
      email: data?.email,
      username: data?.username,
      isActive: data?.isActive,
    };
  }

  async logout(refreshToken: string) {
    const { error } = await oauth.logout(refreshToken);
    if (error) {
      throw new GraphQLError(error.message, {
        extensions: {
          code: error.code,
        },
      });
    }

    return {
      success: true,
    };
  }
}
