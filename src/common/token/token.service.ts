import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

export type JwtPayload = {
  sub?: number;
  exp?: number;
  iat?: number;
};

@Injectable()
export class TokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async generateTokenPair(sub: number) {
    const [accessToken, refreshToken] = await Promise.all([
      await this.jwtService.signAsync(
        {
          sub,
        },
        {
          secret: this.configService.get('ACCESS_TOKEN_SECRET'),
          expiresIn: this.configService.get('ACCESS_TOKEN_EXPIRATION'),
          issuer: this.configService.get<string>('ISSUER'),
          algorithm: this.configService.get<'HS256' | 'RS256'>('ALGORITHM'),
        },
      ),
      await this.jwtService.signAsync(
        {
          sub,
        },
        {
          secret: this.configService.get('REFRESH_TOKEN_SECRET'),
          expiresIn: this.configService.get('REFRESH_TOKEN_EXPIRATION'),
          issuer: this.configService.get<string>('ISSUER'),
          algorithm: this.configService.get<'HS256' | 'RS256'>('ALGORITHM'),
        },
      ),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  async verifyAccessToken(token: string) {
    try {
      return await this.jwtService.verifyAsync<JwtPayload>(token, {
        secret: this.configService.get('ACCESS_TOKEN_SECRET'),
        issuer: this.configService.get<string>('ISSUER'),
        algorithms: ['HS256', 'RS256'],
      });
    } catch (error) {
      return null;
    }
  }

  async verifyRefreshToken(token: string) {
    try {
      return await this.jwtService.verifyAsync<JwtPayload>(token, {
        secret: this.configService.get('REFRESH_TOKEN_SECRET'),
        issuer: this.configService.get<string>('ISSUER'),
        algorithms: ['HS256', 'RS256'],
      });
    } catch (error) {
      return null;
    }
  }
}
