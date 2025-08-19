import { Injectable } from '@nestjs/common';
import { EnchantRepository } from './repository/enchant.respository';
import { EnchantResponseDto } from './dto/enchant-response.dto';

@Injectable()
export class EnchantService {
  constructor(private readonly enchantRepository: EnchantRepository) {}

  async findAllEnchant(): Promise<EnchantResponseDto[]> {
    const enchants = await this.enchantRepository.findAllWithRelations();

    if (!enchants) {
      return [];
    }

    return enchants.map((enchant) => new EnchantResponseDto(enchant));
  }
}
