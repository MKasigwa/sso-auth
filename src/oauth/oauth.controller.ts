import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { OAuthService } from './oauth.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('oauth')
export class OauthController {
  constructor(private oauthService: OAuthService) {}

  @Get('authorize')
  @UseGuards(AuthGuard('jwt'))
  async authorize(
    @Req() req,
    @Query('client_id') clientId: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    @Query('redirect_uri') redirectUri: string,
  ) {
    const authCode = await this.oauthService.generateAuthCode(
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
      req.user,
      clientId,
    );
    return { auth_code: authCode };
  }

  @Post('token')
  async exchangeToken(@Body('auth_code') authCode: string) {
    const accessToken = await this.oauthService.exchangeCodeForToken(authCode);
    if (!accessToken) {
      return { error: 'Invalid auth code' };
    }
    return { access_token: accessToken };
  }
}
