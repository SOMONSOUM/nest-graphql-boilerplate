import { Module } from '@nestjs/common';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';
import { OAuthClientService } from '@/shared/oauth/client.service';
import {
  AccountRepository,
  RefreshTokenRepository,
  UserRepository,
} from '../user/repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account, RefreshToken, User } from '../user/entity';
import { HashService } from '@/common/hash/hash.service';
import { TokenService } from '@/common/token/token.service';
import { RefreshTokenService } from '../user/service/refresh-token.service';
import { JwtStrategy } from './strategy/jwt-strategy';

@Module({
  imports: [TypeOrmModule.forFeature([User, Account, RefreshToken])],
  providers: [
    JwtStrategy,
    AuthResolver,
    AuthService,
    OAuthClientService,
    UserRepository,
    AccountRepository,
    RefreshTokenRepository,
    RefreshTokenService,
    HashService,
    TokenService,
  ],
  exports: [AuthService],
})
export class AuthModule {}
