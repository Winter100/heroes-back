import { Injectable, NotFoundException } from '@nestjs/common';
import { PartholnRepository } from './repository/partholn.repository';
import { PartholnType } from './constant/partholn';
import { PartholnMapper } from './mapper/partholn-mapper';

@Injectable()
export class PartholnService {
  constructor(private readonly partholnRepository: PartholnRepository) {}

  async findAll(): Promise<PartholnType[]> {
    const data = await this.partholnRepository.findPartholn();
    if (data.length === 0)
      throw new NotFoundException('파르홀른 데이터를 찾지 못했습니다.');

    return PartholnMapper.toResponse(data);
  }
}
