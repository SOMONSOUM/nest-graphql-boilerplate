import { HttpStatus, Injectable } from '@nestjs/common';
import { AccountRepository, UserRepository } from './repository';
import { CreateUserInput } from './dto/input';
import { GraphQLError } from 'graphql/error';
import { AuthProvider } from './entity';

@Injectable()
export class UserService {
  constructor(
    private readonly accountRepository: AccountRepository,
    private readonly userRepository: UserRepository,
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
