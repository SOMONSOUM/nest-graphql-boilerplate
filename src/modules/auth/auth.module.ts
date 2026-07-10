import { Module } from '@nestjs/common';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';
import { OAuthClientService } from '@/shared/oauth/client.service';
import { AccountRepository, UserRepository } from '../user/repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account, User } from '../user/entity';
import { GqlAuthGuard } from './guard/gql-auth.guard';

@Module({
  imports: [TypeOrmModule.forFeature([User, Account])],
  providers: [
    AuthResolver,
    AuthService,
    GqlAuthGuard,
    OAuthClientService,
    UserRepository,
    AccountRepository,
  ],
  exports: [AuthService],
})
export class AuthModule {}
