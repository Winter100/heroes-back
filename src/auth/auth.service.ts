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
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

@Injectable()
export class AuthService {
  constructor(
    @InjectPinoLogger(AuthService.name)
    private readonly logger: PinoLogger,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly refreshTokenRepository: RefreshTokenRepository,
    private readonly configService: ConfigService,
  ) {}

  /**
   * 회원가입
   * - 구현은 되어있지만 프론트에서 직접 데이터를 받지는 않음
   * @param signUpDto
   * @returns
   */
  async signup(signUpDto: SignUpDto) {
    this.logger.info({ email: signUpDto.email }, 'signup start');
    const { id } = await this.usersService.createUser(signUpDto);
    this.logger.info({ email: signUpDto.email, id }, 'signup succeeded');
    return { id, message: '가입 성공' };
  }

  /**
   * 로그인 및 토큰 갱신
   * - 액세스 토큰 및 리프레쉬 토큰 생성
   * - 리프레쉬 토큰 DB 저장
   * @param user
   * @returns
   */
  async signin(user: AuthUser): Promise<{
    access_token: string;
    refresh_token: string;
    expiresAt: Date;
  }> {
    this.logger.info({ userId: user.id }, 'login start');
    await this.refreshTokenRepository.revokeAllUserTokens(user.id);

    const { access_token } = await this.signAccessToken(user);
    const { refresh_token, expiresAt } = await this.signAndStoreRefreshToken(
      user.id,
    );

    this.logger.info({ userId: user.id, expiresAt }, 'login succeeded');
    return { access_token, refresh_token, expiresAt };
  }

  /**
   * 액세스 토큰 생성
   * @param user
   * @returns
   */
  async signAccessToken(user: AuthUser) {
    this.logger.info({ userId: user.id }, 'create access token start');
    const payload: AuthJwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    };
    const access_token = await this.jwtService.signAsync(payload);
    this.logger.info({ userId: user.id }, 'create access token succeeded');
    return { access_token };
  }

  /**
   * 리프레쉬 토큰 생성 및 DB저장
   * @param userId
   * @returns
   */
  async signAndStoreRefreshToken(userId: string) {
    const payload = { sub: userId };
    this.logger.info({ userId }, 'create refresh token start');
    const refresh_token = await this.jwtService.signAsync(payload, {
      secret: this.configService.get(TOKEN_KEY.refreshSecretKey),
      expiresIn: this.configService.get(TOKEN_KEY.refreshEx),
    });

    const decoded = this.jwtService.decode<{ exp: number }>(refresh_token);
    const expiresAt = new Date(decoded.exp * 1000);
    const tokenHash = await argon2.hash(refresh_token);

    this.logger.info({ userId }, 'db - create refresh token start');
    await this.refreshTokenRepository.updateHashedRefreshToken(
      userId,
      tokenHash,
      expiresAt,
    );
    this.logger.info({ userId }, 'create refresh token succeeded');
    return { refresh_token, expiresAt };
  }

  /**
   * 유저 찾기
   * @param userId
   * @returns
   */
  async findUserByUserId(userId: string) {
    const user = await this.usersService.findUserByUserId(userId);
    if (!user) throw new BadRequestException();

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, createdAt, updatedAt, ...result } = user;
    return result;
  }

  /**
   * 유효한 리프레쉬 토큰인지 확인
   * @param userId
   * @param refreshToken
   * @returns
   */
  async validateRefreshToken(userId: string, refreshToken: string) {
    this.logger.info({ userId }, 'validate RefreshToken Start');

    const dbRefreshToken = await this.refreshTokenRepository.findOne(userId);

    if (!dbRefreshToken) {
      this.logger.warn({ userId }, "db - don't have refresh token");
      throw new UnauthorizedException('Invalid Refresh Token');
    }

    const refreshTokenMatches = await argon2.verify(
      dbRefreshToken.token,
      refreshToken,
    );

    if (!refreshTokenMatches) {
      this.logger.warn(
        { userId, matches: refreshTokenMatches },
        'db - not matches refresh token',
      );
      throw new UnauthorizedException('Invalid Refresh Token');
    }

    this.logger.info({ userId }, 'validate RefreshToken Succeeded');
    return { userId: dbRefreshToken.userId };
  }

  /**
   * 로그아웃
   * @param userId
   */
  async signOut(userId: string) {
    this.logger.info({ userId }, 'signout start');
    await this.refreshTokenRepository.revokeAllUserTokens(userId);
    this.logger.info({ userId }, 'signout succeeded');
  }

  /**
   * 이메일 및 비밀번호 확인
   * @param email
   * @param password
   * @returns
   */
  async validateUser(email: string, password: string) {
    this.logger.info({ email: email }, 'validateUser Start');
    const user = await this.usersService.findUserByEmail(email);

    if (!user) {
      this.logger.warn({ email: email }, 'unvalidateUser email');
      throw new UnauthorizedException({
        code: 'INVALID_CREDENTIALS',
        message: '아이디 또는 비밀번호가 올바르지 않습니다.',
      });
    }
    const isMatch = await PasswordHasher.compare(password, user.password);

    if (!isMatch) {
      this.logger.warn(
        { email: email, match: isMatch },
        'unvalidateUser password',
      );
      throw new UnauthorizedException({
        code: 'INVALID_CREDENTIALS',
        message: '아이디 또는 비밀번호가 올바르지 않습니다.',
      });
    }

    if (isMatch) {
      this.logger.info({ email: email }, 'validateUser succeeded');
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, createdAt, updatedAt, ...result } = user;
      return result;
    }

    return null;
  }
}
