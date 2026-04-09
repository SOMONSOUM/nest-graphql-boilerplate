import { Injectable } from '@nestjs/common';
import { RefreshTokenRepository } from '../repository';
import { RefreshToken } from '../entity';
import { GraphQLError } from 'graphql/error';

@Injectable()
export class RefreshTokenService {
  constructor(
    private readonly refreshTokenRepository: RefreshTokenRepository,
  ) {}

  async validateRefreshToken(token: string): Promise<boolean> {
    const refreshToken = await this.refreshTokenRepository.findOne({
      where: { token },
    });

    if (refreshToken && refreshToken.revoked) {
      return false;
    }

    return !!refreshToken;
  }

  async revokeRefreshToken(token: string): Promise<boolean> {
    try {
      const refreshToken = await this.refreshTokenRepository.findOne({
        where: { token },
      });
      if (refreshToken) {
        refreshToken.revokedAt = new Date();
        refreshToken.revoked = true;
        await this.refreshTokenRepository.save(refreshToken);
        return true;
      }
      return false;
    } catch (error) {
      if (error instanceof GraphQLError) {
        throw error;
      }
      throw new GraphQLError('Internal server error', {
        extensions: {
          code: 'INTERNAL_SERVER_ERROR',
        },
      });
    }
  }

  /**
   * Create a new refresh token.
   *
   * @param token - The refresh token string.
   * @param userId - The user ID associated with the refresh token.
   *
   * @returns A promise that resolves with the created refresh token entity.
   */
  async createRefreshToken(
    token: string,
    userId: number,
  ): Promise<RefreshToken> {
    const refreshToken = this.refreshTokenRepository.create({
      user: { id: userId },
      token,
      expiresAt: new Date(Date.now() + 7 * 24 * 3600 * 1000), // 7 days expiry
      createdAt: new Date(),
    });

    return await this.refreshTokenRepository.save(refreshToken);
  }
}
