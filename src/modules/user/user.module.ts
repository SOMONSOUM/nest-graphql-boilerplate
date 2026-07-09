import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserResolver } from './user.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account, User } from './entity';
import { AccountRepository, UserRepository } from './repository';
import { HashService } from '@/common/hash/hash.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Account])],
  providers: [
    UserResolver,
    UserService,
    UserRepository,
    AccountRepository,
    HashService,
  ],
  exports: [UserService],
})
export class UserModule {}
