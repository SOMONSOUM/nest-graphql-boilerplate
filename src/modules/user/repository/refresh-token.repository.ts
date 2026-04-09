import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { RefreshToken } from '../entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class RefreshTokenRepository extends Repository<RefreshToken> {
  constructor(
    @InjectRepository(RefreshToken)
    private readonly repository: Repository<RefreshToken>,
  ) {
    super(repository.target, repository.manager, repository.queryRunner);
  }
}
