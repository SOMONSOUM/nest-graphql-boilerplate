import { HttpStatus, Injectable } from '@nestjs/common';
import { GraphQLError } from 'graphql';
import { OAuthClientService } from '@/shared/oauth/client.service';
import { AccountRepository, UserRepository } from '../user/repository';
import { AuthProvider } from '../user/entity';
import { HashService } from '@/common/hash/hash.service';
import { LoginInput } from './dto/input';
import { JwtPayload, TokenService } from '@/common/token/token.service';
import { RefreshTokenService } from '../user/service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly clientService: OAuthClientService,
    private readonly userRepository: UserRepository,
    private readonly accountRepository: AccountRepository,
    private readonly hashService: HashService,
    private readonly tokenService: TokenService,
    private readonly refreshTokenService: RefreshTokenService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
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

  async login(dto: LoginInput) {
    const user = await this.userRepository.findOne({
      where: {
        email: dto.email,
        accounts: {
          authProvider: AuthProvider.LOCAL,
        },
      },
      relations: ['accounts'],
    });

    if (!user) {
      throw new GraphQLError('User not found', {
        extensions: {
          code: HttpStatus.NOT_FOUND,
        },
      });
    }

    const account = await this.accountRepository.findOne({
      where: {
        authProvider: AuthProvider.LOCAL,
        user: {
          id: user.id,
        },
      },
      relations: ['user'],
    });

    if (!account) {
      throw new GraphQLError('User not found', {
        extensions: {
          code: HttpStatus.NOT_FOUND,
        },
      });
    }

    const isMatch = await this.hashService.compareHash(
      dto.password,
      account.password ?? '',
    );

    if (!isMatch) {
      throw new GraphQLError('Invalid credentials', {
        extensions: {
          code: HttpStatus.UNAUTHORIZED,
        },
      });
    }

    const { accessToken, refreshToken } =
      await this.tokenService.generateTokenPair(user.id);

    await this.refreshTokenService.createRefreshToken(refreshToken, user.id);

    return {
      accessToken,
      refreshToken,
    };
  }

  async getLoginToken() {
    try {
      const { data, error } = await this.clientService.getLoginToken();

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

  async callBack(code: string) {
    const { data, error } =
      await this.clientService.validateAuthorizationCode(code);
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

    const user = await this.userRepository.findOne({
      where: {
        email: data.payload.email,
        accounts: {
          authProvider: AuthProvider.MOC_DIGIKEY,
          providerId: data.payload.id,
        },
      },
    });

    if (!user) {
      const user = this.userRepository.create({
        email: data.payload.email,
        username: data.payload.username,
        accounts: [
          {
            authProvider: AuthProvider.MOC_DIGIKEY,
            providerId: data.payload.id,
          },
        ],
      });

      const savedUser = await this.userRepository.save(user);
      const { accessToken, refreshToken } =
        await this.tokenService.generateTokenPair(savedUser.id);

      return {
        accessToken,
        refreshToken,
      };
    }

    const { accessToken, refreshToken } =
      await this.tokenService.generateTokenPair(user.id);
    await this.refreshTokenService.createRefreshToken(refreshToken, user.id);

    return {
      accessToken,
      refreshToken,
    };
  }

  async refreshToken(refreshToken: string) {
    try {
      const [isValidRefreshToken, payload] = await Promise.all([
        this.refreshTokenService.validateRefreshToken(refreshToken),
        this.jwtService.verifyAsync<JwtPayload>(refreshToken, {
          secret: this.configService.get<string>('REFRESH_TOKEN_SECRET'),
          issuer: this.configService.get<string>('ISSUER'),
          algorithms: ['HS256'],
        }),
      ]);

      if (!payload.sub || !isValidRefreshToken) {
        throw new GraphQLError('Refresh token expired', {
          extensions: {
            code: HttpStatus.UNAUTHORIZED,
          },
        });
      }

      if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
        throw new GraphQLError('Refresh token expired', {
          extensions: {
            code: HttpStatus.UNAUTHORIZED,
          },
        });
      }

      const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
        await this.tokenService.generateTokenPair(payload?.sub);

      await this.refreshTokenService.revokeRefreshToken(refreshToken);
      await this.refreshTokenService.createRefreshToken(
        newRefreshToken,
        payload.sub,
      );

      return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      };
    } catch (error) {
      if (error instanceof GraphQLError) throw error;
      throw new GraphQLError('Invalid refresh token', {
        extensions: {
          code: HttpStatus.UNAUTHORIZED,
        },
      });
    }
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
    try {
      return await this.refreshTokenService.revokeRefreshToken(refreshToken);
    } catch (error) {
      if (error instanceof GraphQLError) throw error;
      throw new GraphQLError('Internal server error', {
        extensions: {
          code: 'INTERNAL_SERVER_ERROR',
        },
      });
    }
  }
}
