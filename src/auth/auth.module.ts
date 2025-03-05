import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategies/jwt.strategy';
import { UserModule } from 'src/user/user.module';
import { GoogleStrategy } from './strategies/google.strategy';
import { OauthModule } from 'src/oauth/oauth.module';

@Module({
  imports: [
    JwtModule.register({
      secret: 'SECRET_KEY', // Change this in production
      signOptions: { expiresIn: '1h' },
    }),
    PassportModule,
    UserModule,
    OauthModule,
  ],
  providers: [AuthService, JwtStrategy, GoogleStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
