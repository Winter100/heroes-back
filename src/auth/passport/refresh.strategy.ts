import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { TOKEN_KEY } from '../constant/key';
import { Request } from 'express';
import { AuthService } from '../auth.service';

@Injectable()
export class RefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(
    configService: ConfigService,
    private readonly authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-return
          return req?.cookies?.refreshToken;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.get(TOKEN_KEY.refreshSecretKey)!,
      passReqToCallback: true,
    });
  }

  async validate(
    req: Request,
    payload: { sub: string },
  ): Promise<{ userId: string }> {
    const userId = payload.sub;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const refreshToken = req?.cookies?.refreshToken;
    return await this.authService.validateRefreshToken(
      userId,
      refreshToken as string,
    );
  }
}
