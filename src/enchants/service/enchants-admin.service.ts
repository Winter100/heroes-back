import { UpsertEnchantDetailDto } from './../dto/upsert-enchant-detail.dto';
import { EnchantService } from './enchants.service';
import { UpdateEnchantDto } from './../dto/update-enchant.dto';
import { CreateEnchantDto } from './../dto/create-enchant.dto';
import { NexonService } from 'src/nexon/nexon.service';
import { Injectable } from '@nestjs/common';
import { EnchantRepository } from '../repository/enchant.respository';
import { EnchantDropResponseDto } from '../dto/enchant-response.dto';
import { EnchantTransformer } from '../enchant-transformer';
import { aggregateByEnchantPreset } from '../util/enchant-util';
import { Prisma } from '@prisma/client';
import { ItemAdminService } from 'src/items/service/items-admin.service';

@Injectable()
export class EnchantAdminService {
  constructor(
    private readonly enchantRepository: EnchantRepository,
    private readonly nexonService: NexonService,
    private readonly itemAdminService: ItemAdminService,
    private readonly enchantService: EnchantService,
  ) {}

  createEnchant(createEnchantDto: CreateEnchantDto) {
    const createData: Prisma.EnchantCreateInput = {
      name: createEnchantDto.name,
      rank: { connect: { id: createEnchantDto.rankId } },
      tier: { connect: { id: createEnchantDto.tierId } },
      category: createEnchantDto.category,
      affix: { connect: { id: createEnchantDto.affixId } },
    };
    return this.enchantRepository.createEnchant(createData);
  }

  async updateEnchant(enchantId: number, updateEnchantDto: UpdateEnchantDto) {
    await this.enchantService.findEnchantById(enchantId);
    const updateData: Prisma.EnchantUpdateInput = {};

    if (updateEnchantDto.name) {
      updateData.name = updateEnchantDto.name;
    }

    if (updateEnchantDto.category) {
      updateData.category = updateEnchantDto.category;
    }

    if (updateEnchantDto.rankId) {
      updateData.rank = { connect: { id: updateEnchantDto.rankId } };
    }

    if (updateEnchantDto.tierId) {
      updateData.tier = { connect: { id: updateEnchantDto.tierId } };
    }

    if (updateEnchantDto.affixId) {
      updateData.affix = { connect: { id: updateEnchantDto.affixId } };
    }

    return this.enchantRepository.updateEnchant(enchantId, updateData);
  }

  async upsertEnchant(
    enchantId: number,
    upsertEnchantDetailDto: UpsertEnchantDetailDto,
  ) {
    await this.enchantService.findEnchantById(enchantId);

    const upsertData: Prisma.EnchantUpdateInput = {};
    if (upsertEnchantDetailDto?.slotsId) {
      upsertData.enchantSlot = {
        deleteMany: { enchantId },
        ...(upsertEnchantDetailDto.slotsId.length > 0 && {
          createMany: {
            data: upsertEnchantDetailDto.slotsId.map((slot) => ({
              slotId: slot.slotId,
            })),
          },
        }),
      };
    }
    if (upsertEnchantDetailDto?.effects) {
      upsertData.effects = {
        deleteMany: { enchantId },

        ...(upsertEnchantDetailDto.effects.length > 0 && {
          createMany: {
            data: upsertEnchantDetailDto.effects.map((effect) => ({
              statId: effect.statId,
              value: effect?.value ? effect?.value : '',
            })),
          },
        }),
      };
    }
    return this.enchantRepository.upsertEnchant(enchantId, upsertData);
  }
  deleteEnchant(enchantId: number) {
    return this.enchantRepository.deleteEnchant(enchantId);
  }

  async getEnchantFormData() {
    const [basic, stats] = await Promise.all([
      this.itemAdminService.getBasicId(),
      this.itemAdminService.getStatsId(),
    ]);
    return { slot: basic.slot, stats };
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

  // async updateEnchant(enchantDropCreateDto: EnchantDropCreateDto) {
  //   return await this.enchantRepository.updateEnchantDrop(enchantDropCreateDto);
  // }

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
