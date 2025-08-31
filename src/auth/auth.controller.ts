import {
  Body,
  Controller,
  Post,
  Req,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { SignUpDto } from './dto/signUp.dto';
import { AuthService } from './auth.service';
import { AuthUser } from './types/auth-user';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserRole } from '@prisma/client';
import { JwtAuthGuard } from './guards/jwt-token.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Response } from 'express';
import { RefreshAuthGuard } from './guards/refresh-token.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('signin')
  async login(
    @Request() req: { user: AuthUser },
    @Res({ passthrough: true }) res: Response,
  ) {
    const { access_token, refresh_token, expiresAt } =
      await this.authService.signin(req.user);
    res.cookie('refreshToken', refresh_token, {
      httpOnly: true,
      sameSite: 'strict',
      expires: expiresAt,
      path: '/auth',
    });
    return { access_token };
  }

  @UseGuards(RefreshAuthGuard)
  @Post('refresh')
  async refresh(@Request() req: { user: { userId: string } }) {
    const user = await this.authService.findUserByUserId(req.user.userId);
    const access_token = await this.authService.signAccessToken(user);

    return { access_token };
  }

  @Roles(UserRole.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post('signup')
  async signUp(@Body() signUpDto: SignUpDto) {
    await this.authService.signup(signUpDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('signout')
  async signOut(@Req() req: AuthUser) {
    await this.authService.signOut(req.id);
  }
}
