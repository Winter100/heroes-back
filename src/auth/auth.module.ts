import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/users/users.module';
import { LocalStrategy } from './passport/local.strategy';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './passport/jwt.strategy';
import { RefreshTokenRepository } from './repository/refresh-token.repository';
import { ConfigService } from '@nestjs/config';
import { RefreshStrategy } from './passport/refresh.strategy';
import { TOKEN_KEY } from './constant/key';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get(TOKEN_KEY.accessSecretKey),
        signOptions: {
          expiresIn: configService.get(TOKEN_KEY.accessEx),
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy,
    RefreshStrategy,
    RefreshTokenRepository,
  ],
})
export class AuthModule {}
