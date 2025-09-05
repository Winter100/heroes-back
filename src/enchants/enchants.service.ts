import { Injectable } from '@nestjs/common';
import { EnchantRepository } from './repository/enchant.respository';
import {
  EnchantDropResponseDto,
  EnchantResponseDto,
} from './dto/enchant-response.dto';
import { EnchantTransformer } from './enchant-transformer';
import { EnchantDropCreateDto } from './dto/enchant-drop-create.dto';

@Injectable()
export class EnchantService {
  constructor(private readonly enchantRepository: EnchantRepository) {}

  async findAllEnchant(): Promise<EnchantResponseDto[]> {
    const enchants = await this.enchantRepository.findAllWithRelations();

    if (!enchants) return [];

    return enchants.map((enchant) =>
      EnchantTransformer.toResponseDto(enchant, {
        includeDrops: false,
      }),
    );
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

  async updateEnchant(enchantDropCreateDto: EnchantDropCreateDto) {
    return await this.enchantRepository.updateEnchantDrop(enchantDropCreateDto);
  }
}
