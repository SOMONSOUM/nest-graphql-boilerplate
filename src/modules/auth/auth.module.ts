import { Module } from '@nestjs/common';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';
import { OAuthClientService } from '@/shared/oauth/client.service';

@Module({
  providers: [AuthResolver, AuthService, OAuthClientService],
  exports: [],
})
export class AuthModule {}
