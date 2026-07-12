import { HttpStatus, Injectable } from '@nestjs/common';
import { GraphQLError } from 'graphql';
import { OAuthClientService } from '@/shared/oauth/client.service';
import { AccountRepository, UserRepository } from '../user/repository';
import { AuthProvider } from '../user/entity';
import { GetLoginTokenInput } from './dto/input';

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
    const response = await this.clientService.getLoginToken(input);

    if (!response.success || !response.data?.redirectUri) {
      throw new GraphQLError(
        response.error?.message ?? 'Invalid client credentials',
        {
          extensions: {
            code: response.error?.code ?? 'INVALID_CLIENT_CREDENTIALS',
          },
        },
      );
    }

    return response.data;
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

    const payload = data.payload as typeof data.payload & {
      position?: string;
    };
    const identityEmail = payload.username ?? payload.email;

    const userProfile = {
      email: identityEmail,
      username: payload.username,
      nationalId: payload.nationalId,
      fullNameKm: payload.fullNameKm,
      fullNameEn: payload.fullNameEn,
      dob: payload.dob,
      profileUrl: payload.profileUrl,
      gender: payload.gender,
      position: payload.position,
      phoneNumber: payload.phoneNumber,
      isActive: payload.isActive,
    };
    const profileUpdates = Object.fromEntries(
      Object.entries(userProfile).filter(([, value]) => value !== undefined),
    );
    const mocAccount = {
      authProvider: AuthProvider.MOC_DIGIKEY,
      providerId: payload.id,
    };

    const account = await this.accountRepository.findOne({
      where: {
        authProvider: mocAccount.authProvider,
        providerId: mocAccount.providerId,
      },
      relations: {
        user: true,
      },
    });

    if (account?.user) {
      await this.userRepository.save({
        ...account.user,
        ...profileUpdates,
      });
      return providerTokens;
    }

    if (!identityEmail) {
      throw new GraphQLError('Identity provider did not return a username', {
        extensions: {
          code: HttpStatus.BAD_REQUEST,
        },
      });
    }

    const existingUser =
      await this.userRepository.findOne({
        where: {
          email: identityEmail,
        },
      });

    if (existingUser) {
      const updatedUser = await this.userRepository.save({
        ...existingUser,
        ...profileUpdates,
      });

      await this.accountRepository.save(
        this.accountRepository.create({
          ...mocAccount,
          user: updatedUser,
        }),
      );

      return providerTokens;
    }

    const createdUser = this.userRepository.create({
      ...profileUpdates,
      email: identityEmail,
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
