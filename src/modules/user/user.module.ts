import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserResolver } from './user.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account, RefreshToken, User } from './entity';
import {
  AccountRepository,
  RefreshTokenRepository,
  UserRepository,
} from './repository';
import { HashService } from '@/common/hash/hash.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Account, RefreshToken])],
  providers: [
    UserResolver,
    UserService,
    UserRepository,
    AccountRepository,
    RefreshTokenRepository,
    HashService,
  ],
  exports: [UserService],
})
export class UserModule {}
