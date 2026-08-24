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
      sameSite: 'lax',
      // sameSite: 'strict',
      expires: expiresAt,
      path: '/',
    });
    return { accessToken: access_token };
  }

  @UseGuards(RefreshAuthGuard)
  @Post('refresh')
  async refresh(
    @Request() req: { user: { userId: string } },
    @Res({ passthrough: true }) res: Response,
  ) {
    try {
      const user = await this.authService.findUserByUserId(req.user.userId);
      const { access_token } = await this.authService.signAccessToken(user);

      return { accessToken: access_token };
    } catch (error) {
      res.clearCookie('refreshToken', {
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        path: '/',
      });

      throw error;
    }
  }

  @Roles(UserRole.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post('signup')
  async signUp(@Body() signUpDto: SignUpDto) {
    await this.authService.signup(signUpDto);
  }

  // @UseGuards(JwtAuthGuard)
  @Post('signout')
  async signOut(
    @Req() req: AuthUser,
    @Res({ passthrough: true }) res: Response,
  ) {
    await this.authService.signOut(req.id);
    res.clearCookie('refreshToken', {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
    });

    return { message: '로그아웃 되었습니다' };
  }
}
