import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
// import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { OAuthClient } from './oauth-client.entity';
import { UserService } from 'src/user/user.service';
import { User } from 'src/user/user.entity';

@Injectable()
export class OAuthService {
  constructor(
    @InjectRepository(OAuthClient) private clientRepo: Repository<OAuthClient>,
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateClient(
    clientId: string,
    clientSecret: string,
  ): Promise<boolean> {
    const client = await this.clientRepo.findOne({
      where: { clientId, clientSecret },
    });
    return !!client;
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async generateAuthCode(user: User, clientId: string): Promise<string> {
    return this.jwtService.sign(
      { userId: user.id, clientId },
      { expiresIn: '5m' },
    );
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async exchangeCodeForToken(authCode: string): Promise<string | null> {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const payload = this.jwtService.verify(authCode);
      return this.jwtService.sign(
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        { userId: payload.userId },
        { expiresIn: '1h' },
      );
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      return null;
    }
  }

  async registerClient(
    clientId: string,
    my_secret: string,
    redirectUrl: string,
  ): Promise<OAuthClient> {
    const oauthToSave = this.clientRepo.create({
      clientId: clientId,
      clientSecret: my_secret,
      redirectUrl: redirectUrl,
    });
    return this.clientRepo.save(oauthToSave);
  }
}
