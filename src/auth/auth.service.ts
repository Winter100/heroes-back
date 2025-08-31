import { RefreshTokenRepository } from './repository/refresh-token.repository';
import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { PasswordHasher } from './utils/password.hasher';
import { SignUpDto } from './dto/signUp.dto';
import { AuthUser } from './types/auth-user';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthJwtPayload } from './types/auth-jwt-payload';
import * as argon2 from 'argon2';
import { TOKEN_KEY } from './constant/key';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly refreshTokenRepository: RefreshTokenRepository,
    private readonly configService: ConfigService,
  ) {}

  async signup(signUpDto: SignUpDto) {
    return await this.usersService.createUser(signUpDto);
  }

  async signin(user: AuthUser): Promise<{
    access_token: string;
    refresh_token: string;
    expiresAt: Date;
  }> {
    await this.refreshTokenRepository.revokeAllUserTokens(user.id);

    const { access_token } = await this.signAccessToken(user);
    const { refresh_token, expiresAt } = await this.signAndStoreRefreshToken(
      user.id,
    );

    return { access_token, refresh_token, expiresAt };
  }

  async signAccessToken(user: AuthUser) {
    const payload: AuthJwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    };

    const access_token = await this.jwtService.signAsync(payload);

    return { access_token };
  }

  async signAndStoreRefreshToken(userId: string) {
    const payload = { sub: userId };
    const refresh_token = await this.jwtService.signAsync(payload, {
      secret: this.configService.get(TOKEN_KEY.refreshSecretKey),
      expiresIn: this.configService.get(TOKEN_KEY.refreshEx),
    });

    const decoded = this.jwtService.decode<{ exp: number }>(refresh_token);
    const expiresAt = new Date(decoded.exp * 1000);
    const tokenHash = await argon2.hash(refresh_token);

    await this.refreshTokenRepository.updateHashedRefreshToken(
      userId,
      tokenHash,
      expiresAt,
    );

    return { refresh_token, expiresAt };
  }

  async findUserByUserId(userId: string) {
    const user = await this.usersService.findUserByUserId(userId);
    if (!user) throw new BadRequestException();

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, createdAt, updatedAt, ...result } = user;
    return result;
  }

  async validateRefreshToken(userId: string, refreshToken: string) {
    const dbRefreshToken = await this.refreshTokenRepository.findOne(userId);

    if (!dbRefreshToken)
      throw new UnauthorizedException('Invalid Refresh Token');

    const refreshTokenMatches = await argon2.verify(
      dbRefreshToken.token,
      refreshToken,
    );
    if (!refreshTokenMatches)
      throw new UnauthorizedException('Invalid Refresh Token');

    return { userId: dbRefreshToken.userId };
  }

  async signOut(userId: string) {
    await this.refreshTokenRepository.revokeAllUserTokens(userId);
  }

  async validateUser(email: string, password: string) {
    const user = await this.usersService.findUserByEmail(email);

    if (!user) return null;

    const isSameUser = await PasswordHasher.compare(password, user.password);

    if (isSameUser) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, createdAt, updatedAt, ...result } = user;
      return result;
    }

    return null;
  }
}
