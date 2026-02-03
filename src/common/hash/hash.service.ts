import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { GraphQLError } from 'graphql';

@Injectable()
export class HashService {
  async hash(password: string, salt: number = 10): Promise<string> {
    try {
      return await bcrypt.hash(password, salt);
    } catch (error) {
      throw new GraphQLError('Error hashing password', {
        extensions: {
          code: 'ERROR_HASHING_PASSWORD',
        },
      });
    }
  }

  async compareHash(password: string, hash: string): Promise<boolean> {
    try {
      return await bcrypt.compare(password, hash);
    } catch (error) {
      throw new GraphQLError('Error verifying password', {
        extensions: {
          code: 'ERROR_VERIFYING_PASSWORD',
        },
      });
    }
  }
}
