import { HttpStatus, Injectable } from '@nestjs/common';
import { GraphQLError } from 'graphql';
import { OAuthClientService } from '@/shared/oauth/client.service';
import { AccountRepository, UserRepository } from '../user/repository';
import { AuthProvider } from '../user/entity';
import { GetLoginTokenInput, LoginInput } from './dto/input';

@Injectable()
export class AuthService {
  constructor(
    private readonly clientService: OAuthClientService,
    private readonly userRepository: UserRepository,
    private readonly accountRepository: AccountRepository,
  ) {}

  async findUserByEmail(email: string) {
    const user = await this.userRepository.findOne({
      where: {
        email,
      },
    });

    if (!user) {
      throw new GraphQLError('User not found', {
        extensions: {
          code: HttpStatus.NOT_FOUND,
        },
      });
    }
    return user;
  }

  async getLoginToken(input: GetLoginTokenInput) {
    try {
      const { data, error } = await this.clientService.getLoginToken(input);

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

  async callBack(code: string, codeVerifier: string) {
    const { data, error } = await this.clientService.validateAuthorizationCode({
      code,
      codeVerifier,
    });
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

    const providerTokens = {
      accessToken: data.payload.accessToken,
      refreshToken: data.payload.refreshToken,
    };

    const mocAccount = {
      authProvider: AuthProvider.MOC_DIGIKEY,
      providerId: data.payload.id,
    };

    const user = await this.userRepository.findOne({
      where: {
        accounts: mocAccount,
      },
    });

    if (user) {
      return providerTokens;
    }

    const existingUser = await this.userRepository.findOne({
      where: {
        email: data.payload.email,
      },
    });

    if (existingUser) {
      await this.accountRepository.save(
        this.accountRepository.create({
          ...mocAccount,
          user: existingUser,
        }),
      );

      return providerTokens;
    }

    const createdUser = this.userRepository.create({
      email: data.payload.email,
      username: data.payload.username,
      accounts: [mocAccount],
    });

    await this.userRepository.save(createdUser);
    return providerTokens;
  }

  async refreshToken(refreshToken: string) {
    const { data, error } = await this.clientService.refreshToken(refreshToken);

    if (error || !data) {
      throw new GraphQLError(error?.message ?? 'Invalid refresh token', {
        extensions: {
          code: error?.code ?? HttpStatus.UNAUTHORIZED,
        },
      });
    }

    return data;
  }

  async getCurrentUser(email: string) {
    const user = await this.userRepository.findOne({
      where: {
        email,
      },
    });

    if (!user) {
      throw new GraphQLError('User not found', {
        extensions: {
          code: HttpStatus.NOT_FOUND,
        },
      });
    }

    return user;
  }

  async logout(refreshToken: string) {
    const { data, error } = await this.clientService.logout(refreshToken);

    if (error) {
      throw new GraphQLError(error.message, {
        extensions: {
          code: error.code,
        },
      });
    }

    return data;
  }
}
