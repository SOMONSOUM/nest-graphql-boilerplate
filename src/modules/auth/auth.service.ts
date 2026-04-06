import { Injectable } from '@nestjs/common';
import { GraphQLError } from 'graphql';
import { oauth } from 'src/shared/oauth/client';

@Injectable()
export class AuthService {
  constructor() {}

  async login() {
    try {
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
    } catch (error) {
      console.log({ error });
    }
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
      id: data?.id,
      email: data?.email,
      username: data?.username,
      isActive: data?.isActive,
    };
  }
}
