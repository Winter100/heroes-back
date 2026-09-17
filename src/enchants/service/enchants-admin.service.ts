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
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { EventEmitter2 } from 'eventemitter2';
import { EnchantUpdatedEvent } from '../event/enchant-updated.event';

@Injectable()
export class EnchantAdminService {
  constructor(
    @InjectPinoLogger(EnchantAdminService.name)
    private readonly logger: PinoLogger,
    private readonly enchantRepository: EnchantRepository,
    private readonly nexonService: NexonService,
    private readonly itemAdminService: ItemAdminService,
    private readonly enchantService: EnchantService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  /**
   * 기본 인챈트 생성
   * @param createEnchantDto
   * @returns
   */
  async createEnchant(createEnchantDto: CreateEnchantDto) {
    this.logger.info(
      { enchant: createEnchantDto.name },
      'create enchant start',
    );
    const createData: Prisma.EnchantCreateInput = {
      name: createEnchantDto.name,
      rank: { connect: { id: createEnchantDto.rankId } },
      tier: { connect: { id: createEnchantDto.tierId } },
      category: createEnchantDto.category,
      affix: { connect: { id: createEnchantDto.affixId } },
    };
    this.logger.info(
      { enchant: createEnchantDto.name },
      'create enchant succeeded',
    );

    this.eventEmitter.emit(EnchantUpdatedEvent.name);
    return this.enchantRepository.createEnchant(createData);
  }

  /**
   * 기본 인챈트 정보 수정
   * @param enchantId
   * @param updateEnchantDto
   * @returns
   */
  async updateEnchant(enchantId: number, updateEnchantDto: UpdateEnchantDto) {
    this.logger.info(
      { enchantId: enchantId, updateName: updateEnchantDto.name },
      'update enchant start',
    );
    await this.enchantService.findEnchantOneBy({
      enchant: enchantId,
      order: 'id',
    });
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

    const data = await this.enchantRepository.updateEnchant(
      enchantId,
      updateData,
    );
    this.logger.info({ enchantId: enchantId }, 'update enchant succeeded');
    this.eventEmitter.emit(EnchantUpdatedEvent.name);

    return data;
  }

  /**
   * 인챈트 상세 정보 수정
   * - 효과
   * @param enchantId
   * @param upsertEnchantDetailDto
   * @returns
   */
  async upsertEnchant(
    enchantId: number,
    upsertEnchantDetailDto: UpsertEnchantDetailDto,
  ) {
    this.logger.info({ enchantId: enchantId }, 'upsert detail enchant start');
    await this.enchantService.findEnchantOneBy({
      enchant: enchantId,
      order: 'id',
    });

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
    this.logger.info(
      { enchantId: enchantId },
      'upsert detail enchant succeeded',
    );
    return this.enchantRepository.upsertEnchant(enchantId, upsertData);
  }

  /**
   * 인챈트 삭제
   * @param enchantId
   * @returns
   */
  async deleteEnchant(enchantId: number) {
    const deleted = await this.enchantRepository.deleteEnchant(enchantId);
    this.logger.info({ enchantId }, 'delete enchant succeeded');
    this.eventEmitter.emit(EnchantUpdatedEvent.name);

    return deleted;
  }

  /**
   * 인챈트 생성에 필요한 정보
   * @returns
   */
  async getEnchantFormData() {
    const [basic, stats] = await Promise.all([
      this.itemAdminService.getBasicId(),
      this.itemAdminService.getStatsId(),
    ]);
    return { slot: basic.slot, stats };
  }

  /**
   * 인챈트 드랍 조회
   * @returns
   */
  async findEnchantDrop(): Promise<EnchantDropResponseDto[]> {
    const enchants = await this.enchantRepository.findAllWithRelations();

    if (!enchants) return [];

    return enchants.map((enchant) =>
      EnchantTransformer.toResponseDto(enchant, {
        includeDrops: true,
      }),
    );
  }

  /**
   * 모든 인챈트 가격 조회
   * @returns
   */
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
