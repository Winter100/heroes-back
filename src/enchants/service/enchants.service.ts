import { NexonService } from 'src/nexon/nexon.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { EnchantRepository } from '../repository/enchant.respository';
import {
  EnchantDropResponseDto,
  EnchantResponseDto,
} from '../dto/enchant-response.dto';
import { EnchantTransformer } from '../enchant-transformer';
import { EnchantDropCreateDto } from '../dto/enchant-drop-create.dto';
import { EnchantCategory } from '@prisma/client';
import { EnchantMapper } from 'src/items/mapper/enchant-mapper';
import { aggregateByEnchantPreset } from '../util/enchant-util';

@Injectable()
export class EnchantService {
  constructor(
    private readonly enchantRepository: EnchantRepository,
    private readonly nexonService: NexonService,
  ) {}

  async findAllEnchant(
    category: EnchantCategory = EnchantCategory.ENCHANT,
  ): Promise<EnchantResponseDto[]> {
    const enchants =
      await this.enchantRepository.findAllWithRelations(category);

    if (!enchants) return [];

    return EnchantMapper.toResponse(enchants);
  }

  async findEnchantDrop(): Promise<EnchantDropResponseDto[]> {
    const enchants = await this.enchantRepository.findAllWithRelations();

    if (!enchants) return [];

    return enchants.map((enchant) =>
      EnchantTransformer.toResponseDto(enchant, {
        includeDrops: true,
      }),
    );
  }

  async findEnchantById(enchantId: number) {
    const enchant = await this.enchantRepository.findEnchantById(enchantId);
    if (!enchant) throw new NotFoundException('인챈트가 존재하지 않습니다');
    return enchant;
  }

  async updateEnchant(enchantDropCreateDto: EnchantDropCreateDto) {
    return await this.enchantRepository.updateEnchantDrop(enchantDropCreateDto);
  }

  async findAllPrice() {
    try {
      const enchantPriceList = await this.nexonService.getEnchantPrice();
      const flatEnchant = enchantPriceList.flatMap((data) => data.item);
      return aggregateByEnchantPreset(flatEnchant);
    } catch {
      return [];
    }
  }
}
