import { Injectable } from '@nestjs/common';
import { EnchantRepository } from './repository/enchant.respository';
import {
  EnchantDropResponseDto,
  EnchantResponseDto,
} from './dto/enchant-response.dto';
import { EnchantTransformer } from './enchant-transformer';
import { EnchantDropCreateDto } from './dto/enchant-drop-create.dto';
import { plainToInstance } from 'class-transformer';
import { EnchantCategory } from '@prisma/client';

@Injectable()
export class EnchantService {
  constructor(private readonly enchantRepository: EnchantRepository) {}

  async findAllEnchant(
    category: EnchantCategory = EnchantCategory.ENCHANT,
  ): Promise<EnchantResponseDto[]> {
    const enchants =
      await this.enchantRepository.findAllWithRelations(category);

    if (!enchants) return [];

    return plainToInstance(EnchantResponseDto, enchants);
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
