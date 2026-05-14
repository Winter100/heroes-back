import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

interface UPartholnRepository {
  findPartholn(): unknown;
}

@Injectable()
export class PartholnRepository implements UPartholnRepository {
  constructor(private readonly prismaService: PrismaService) {}
  async findPartholn() {
    return await this.prismaService.partholn.findMany({
      select: {
        name: true,
        rank: true,
        affix: {
          select: {
            name: true,
            value: true,
          },
        },
        effects: {
          select: {
            stat: {
              select: {
                name: true,
              },
            },
            value: true,
          },
        },
      },
    });
  }
}
