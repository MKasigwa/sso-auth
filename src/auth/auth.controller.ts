import {
  Controller,
  Post,
  Body,
  UnauthorizedException,
  UseGuards,
  Get,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(
    @Body('email') email: string,
    @Body('password') password: string,
    @Body('displayName') displayName: string,
  ): Promise<any> {
    return this.authService.register(email, password, displayName);
  }

  @Post('login')
  async login(
    @Body('email') email: string,
    @Body('password') password: string,
  ) {
    const token = await this.authService.validateUser(email, password);
    if (!token) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return { access_token: token };
  }

  @Get('profile')
  @UseGuards(AuthGuard('jwt'))
  getProfile() {
    return { message: 'This is a protected route!' };
  }

  // Redirect user to Google login
  @Get('google')
  @UseGuards(AuthGuard('google'))
  // eslint-disable-next-line @typescript-eslint/require-await
  async googleLogin(): Promise<any> {
    return { message: 'Redirecting to Google...' };
  }

  // Google OAuth callback URL
  @Get('google/redirect')
  @UseGuards(AuthGuard('google'))
  // eslint-disable-next-line @typescript-eslint/require-await
  async googleRedirect(@Req() req): Promise<any> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    return { user: req.user };
  }
}
