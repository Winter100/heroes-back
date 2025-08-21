import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async create(email: string, name: string, password: string) {
    return await this.prismaService.user.create({
      data: {
        email,
        name,
        password,
      },
    });
  }

  async findUserByEmail(email: string) {
    return await this.prismaService.user.findUnique({
      where: {
        email,
      },
    });
  }
}
