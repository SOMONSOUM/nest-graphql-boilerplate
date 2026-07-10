import { HttpStatus, Injectable } from '@nestjs/common';
import { AccountRepository, UserRepository } from './repository';
import { CreateUserInput } from './dto/input';
import { GraphQLError } from 'graphql/error';
import { AuthProvider } from './entity';
import { HashService } from '@/common/hash/hash.service';

@Injectable()
export class UserService {
  constructor(
    private readonly accountRepository: AccountRepository,
    private readonly userRepository: UserRepository,
    private readonly hashService: HashService,
  ) {}

  async registerUser(dto: CreateUserInput) {
    const existingUser = await this.userRepository.findOne({
      where: {
        email: dto.email,
      },
    });

    if (existingUser) {
      throw new GraphQLError('User already exists', {
        extensions: {
          code: HttpStatus.CONFLICT,
        },
      });
    }

    dto.password = await this.hashService.hash(dto.password);

    const user = this.userRepository.create({
      email: dto.email,
      username: dto.username,
      accounts: [
        {
          authProvider: AuthProvider.LOCAL,
          password: dto.password,
        },
      ],
    });

    await this.userRepository.save(user);
    return user;
  }
}
