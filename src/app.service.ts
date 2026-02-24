import {
  Injectable,
  Logger,
  OnApplicationBootstrap,
  OnApplicationShutdown,
} from '@nestjs/common';
import {
  LOGGER_CONTEXT,
  SHUTDOWN_MESSAGE,
  BOOTSTRAP_MESSAGE,
} from './constants';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AllowedColor } from './create-user.dto';

ConfigModule.forRoot({
  isGlobal: true,
  envFilePath: '.env',
});

const configService = new ConfigService();
const port = configService.getOrThrow<number>('PORT') || 3000;
const host = configService.getOrThrow<string>('HOST') || 'localhost';

@Injectable()
export class AppService
  implements OnApplicationBootstrap, OnApplicationShutdown
{
  private readonly logger = new Logger(LOGGER_CONTEXT);

  onApplicationBootstrap() {
    this.logger.log(BOOTSTRAP_MESSAGE(host, port));
  }

  onApplicationShutdown() {
    this.logger.log(SHUTDOWN_MESSAGE);

    process.exit(0);
  }

  getHello(): string {
    return 'Hello World!';
  }

  createUser(email: string, password: string, favoriteColor: AllowedColor) {
    return { email, password, favoriteColor };
  }
}
