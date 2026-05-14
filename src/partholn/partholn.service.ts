import { Injectable } from '@nestjs/common';
import { PartholnRepository } from './repository/partholn.repository';
import { PartholnType } from './constant/partholn';

@Injectable()
export class PartholnService {
  constructor(private readonly partholnRepository: PartholnRepository) {}

  async findAll(): Promise<PartholnType[]> {
    const data = await this.partholnRepository.findPartholn();
    return data.map(({ effects, ...rest }) => ({
      ...rest,
      effects: effects.map((e) => ({
        stat_name: e.stat.name,
        stat_value: e.value,
      })),
    }));
  }
}
