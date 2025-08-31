import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class RefreshTokenRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async updateHashedRefreshToken(
    userId: string,
    hashedRefreshToken: string,
    expiresAt: Date,
  ) {
    await this.prismaService.refreshToken.upsert({
      where: { userId },
      create: {
        userId,
        token: hashedRefreshToken,
        expiresAt,
      },
      update: {
        token: hashedRefreshToken,
        expiresAt,
      },
    });
  }

  async findOne(userId: string) {
    return await this.prismaService.refreshToken.findUnique({
      where: {
        userId,
      },
    });
  }

  async revokeAllUserTokens(userId: string) {
    return await this.prismaService.refreshToken.deleteMany({
      where: {
        userId,
      },
    });
  }

  async revokeToken(hashedRefreshToken: string) {
    return await this.prismaService.refreshToken.deleteMany({
      where: {
        token: hashedRefreshToken,
      },
    });
  }
}
