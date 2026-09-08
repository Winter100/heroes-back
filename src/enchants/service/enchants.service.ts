import { NexonService } from 'src/nexon/nexon.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { EnchantRepository } from '../repository/enchant.respository';
import {
  EnchantDropResponseDto,
  EnchantResponseDto,
} from '../dto/enchant-response.dto';
import { EnchantTransformer } from '../enchant-transformer';
import { EnchantCategory } from '@prisma/client';
import { EnchantMapper } from 'src/items/mapper/enchant-mapper';
import {
  aggregateByEnchantPreset,
  convertPriceMap,
  mergeEnchantPriceServer,
} from '../util/enchant-util';
import { RedisService } from 'src/redis/redis.service';
import { RedisKeys } from 'src/redis/redis-keys.constant';

@Injectable()
export class EnchantService {
  constructor(
    private readonly enchantRepository: EnchantRepository,
    private readonly nexonService: NexonService,
    private readonly redisService: RedisService,
  ) {}
  async findAllEnchant(
    category: EnchantCategory = EnchantCategory.ENCHANT,
  ): Promise<EnchantResponseDto[]> {
    return this.redisService.getOrSet(
      RedisKeys.enchantList(category),
      60 * 60,
      async () => {
        const entities =
          await this.enchantRepository.findAllWithRelations(category);

        return entities.map((enchant) => EnchantMapper.toResponse(enchant));
      },
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

  async findEnchantOneBy(
    params:
      | { enchant: number; order: 'id' }
      | { enchant: string; order: 'name' },
  ) {
    const result =
      params.order === 'id'
        ? await this.enchantRepository.findEnchantById(params.enchant)
        : await this.enchantRepository.findEnchantByName(params.enchant);

    if (!result) {
      throw new NotFoundException('인챈트가 존재하지 않습니다');
    }

    return EnchantMapper.toResponse(result);
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

  /**
   * 프론트엔드 SSG용 인챈트 아이디 및 이름
   * @returns
   */
  async getEnchantSSG() {
    return this.redisService.getOrSet(
      RedisKeys.enchantSSG(),
      60 * 60,
      async () => {
        return await this.enchantRepository.getEnchantSSG();
      },
    );
  }

  async getEnchantTable() {
    const [enchants, enchantPrice] = await Promise.all([
      this.findAllEnchant(),
      this.findAllPrice(),
    ]);

    const enchantPriceMap = convertPriceMap(enchantPrice);

    return mergeEnchantPriceServer(enchants, enchantPriceMap);
  }

  /**
   * 인챈트 통계
   **/
  async findStatistics() {
    return this.redisService.getOrSet(
      RedisKeys.enchantStatistics(),
      60 * 60,
      async () => {
        return this.enchantRepository.getEnchantStats();
      },
    );
  }
}
