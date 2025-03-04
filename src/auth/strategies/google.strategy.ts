import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { AuthService } from '../auth.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private authService: AuthService) {
    super({
      clientID: process.env.GOOGLE_CLIENTID ?? '', // Replace with actual Client ID
      clientSecret: process.env.GOOGLE_CLIENTSECRET ?? '', // Replace with actual Secret
      callbackURL:
        process.env.GOOGLE_CALLBACKURL ??
        'http://localhost:3000/auth/google/redirect',
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const { emails, displayName } = profile;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    const email = emails[0].value;

    const user = await this.authService.validateGoogleUser(
      email as string,
      displayName as string,
    );
    return done(null, user);
  }
}
