import { HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserRepository } from '@/modules/user/repository';
import { JwtPayload } from '@/common/token/token.service';
import { GraphQLError } from 'graphql/error';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly configService: ConfigService,
    private readonly userRespository: UserRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('ACCESS_TOKEN_SECRET'),
    });
  }

  /**
   * Validate JWT payload and return user data
   */
  async validate(payload: JwtPayload) {
    const user = await this.userRespository.findOneBy({ id: payload.sub });

    if (!user) {
      throw new GraphQLError('Unauthorized access', {
        extensions: {
          code: HttpStatus.UNAUTHORIZED,
        },
      });
    }
    return {
      id: user.id,
      email: user.email,
      username: user.username,
    };
  }
}
