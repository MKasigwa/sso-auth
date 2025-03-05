import { Module } from '@nestjs/common';
import { UserModule } from 'src/user/user.module';
import { OAuthService } from './oauth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OAuthClient } from './oauth-client.entity';
import { JwtService } from '@nestjs/jwt';
import { OauthController } from './oauth.controller';

@Module({
  imports: [TypeOrmModule.forFeature([OAuthClient]), UserModule],
  providers: [OAuthService, JwtService],
  exports: [OAuthService],
  controllers: [OauthController],
})
export class OauthModule {}
