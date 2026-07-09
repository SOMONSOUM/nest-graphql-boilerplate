import { Module } from '@nestjs/common';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';
import { OAuthClientService } from '@/shared/oauth/client.service';
import { UserRepository } from '../user/repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account, User } from '../user/entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Account])],
  providers: [
    AuthResolver,
    AuthService,
    OAuthClientService,
    UserRepository,
  ],
  exports: [AuthService],
})
export class AuthModule {}
