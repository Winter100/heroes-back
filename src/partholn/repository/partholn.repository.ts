import { Prisma } from '@prisma/client';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class PartholnRepository {
  constructor(private readonly prismaService: PrismaService) {}
  async findPartholn() {
    return await this.prismaService.partholn.findMany({
      select: PartholnWithRelationsSelect,
    });
  }
}

export const PartholnWithRelationsSelect =
  Prisma.validator<Prisma.PartholnSelect>()({
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
  });

export type PartholnWithRelations = Prisma.PartholnGetPayload<{
  select: typeof PartholnWithRelationsSelect;
}>;
