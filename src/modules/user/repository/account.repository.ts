import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Account } from '../entity/account.entity';

@Injectable()
export class AccountRepository extends Repository<Account> {
  constructor(
    @InjectRepository(Account)
    private readonly repository: Repository<Account>,
  ) {
    super(repository.target, repository.manager, repository.queryRunner);
  }
}
