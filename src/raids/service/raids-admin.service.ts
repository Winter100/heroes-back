import { EventEmitter2 } from 'eventemitter2';
import { RaidDetailUpsertDto } from './../dto/raid-detail-upsert.dto';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { RaidRepository } from '../repository/raid.repository';
import { ImageUploadService } from 'src/supabase/imageUpload.service';
import { RaidCreateDto } from '../dto/raid-create.dto';
import { BUCKET_NAME } from 'src/supabase/constant/bucket';
import { UpdateRaidDto } from '../dto/raid-update.dto';
import { RaidTitleCreateDto } from '../dto/raid-title-create.dto';
import { Prisma, RaidTitle } from '@prisma/client';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { RaidUpdatedEvent } from '../event/raid-updated.event';

@Injectable()
export class RaidAdminService {
  constructor(
    @InjectPinoLogger(RaidAdminService.name)
    private readonly logger: PinoLogger,
    private readonly raidRepository: RaidRepository,
    private readonly imageUploadService: ImageUploadService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  /**
   * 모든 레이드 타이틀 조회
   * @returns
   */
  findAllRaidTitles() {
    return this.raidRepository.findAllRaidTitles();
  }

  /**
   * 기본 레이드 생성
   * @param raidCreateDto
   * @param image
   * @returns
   */
  async createRaid(raidCreateDto: RaidCreateDto, image?: Express.Multer.File) {
    this.logger.info(
      { raidId: raidCreateDto.raidId, battle: raidCreateDto.battle },
      'create raid start',
    );
    const imageUrl = image
      ? await this.imageUploadService.uploadImage(image, BUCKET_NAME.raidImages)
      : undefined;

    try {
      this.logger.info(
        { raidId: raidCreateDto.raidId, battle: raidCreateDto.battle },
        'create raid succeeded',
      );
      const data = await this.raidRepository.createRaid(
        raidCreateDto,
        imageUrl,
      );
      this.eventEmitter.emit(RaidUpdatedEvent.name);
      return data;
    } catch (e) {
      if (imageUrl) await this.imageUploadService.deleteImage(imageUrl);
      throw new InternalServerErrorException(e);
    }
  }

  /**
   * 기본 레이드 수정
   * @param raidId
   * @param updateRaidDto
   * @param image
   * @returns
   */
  async updateRaid(
    raidId: number,
    updateRaidDto: UpdateRaidDto,
    image?: Express.Multer.File,
  ) {
    this.logger.info({ raidId }, 'update raid start');
    const findRaid = await this.raidRepository.findRaidById(raidId);

    if (!findRaid)
      throw new NotFoundException(`${raidId}에 해당하는 레이드가 없습니다`);

    const imageUrl = image
      ? await this.imageUploadService.uploadImage(image, BUCKET_NAME.raidImages)
      : undefined;

    try {
      const updateRaid = await this.raidRepository.updateRaid(
        raidId,
        updateRaidDto,
        imageUrl,
      );

      if (findRaid.image && imageUrl)
        await this.imageUploadService.deleteImage(findRaid.image);

      this.eventEmitter.emit(RaidUpdatedEvent.name);
      this.logger.info({ raidId }, 'update raid succeeded');

      return {
        message: `${updateRaid.battle}을 수정했습니다.`,
      };
    } catch {
      if (findRaid.image && imageUrl)
        await this.imageUploadService.deleteImage(imageUrl);

      throw new BadRequestException(
        `${updateRaidDto.battle} 수정에 실패했습니다.`,
      );
    }
  }

  /**
   * 기본 레이드 삭제
   * @param raidId
   * @returns
   */
  async deleteRaid(raidId: number) {
    this.logger.info({ raidId }, 'delete raid start');
    const findRaid = await this.raidRepository.findRaidById(raidId);
    if (!findRaid)
      throw new NotFoundException(`${raidId}에 해당하는 레이드가 없습니다`);
    try {
      await this.raidRepository.delete(raidId);
      if (findRaid.image)
        await this.imageUploadService.deleteImage(findRaid.image);
      this.eventEmitter.emit(RaidUpdatedEvent.name);
      this.logger.info({ raidId }, 'delete raid succeeded');
      return { message: '삭제에 성공했습니다' };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  /**
   * 레이드 상세 정보 수정
   * @param raidId
   * @param raidDetailUpsertDto
   * @returns
   */
  async raidDetailUpsert(
    raidId: number,
    raidDetailUpsertDto: RaidDetailUpsertDto,
  ) {
    this.logger.info({ raidId }, 'start detail upsert raid start');
    const findRaid = await this.raidRepository.findRaidById(raidId);
    if (!findRaid)
      throw new NotFoundException(`${raidId}에 해당하는 레이드가 없습니다`);

    const raidDetailData: Prisma.RaidUpdateInput = {
      bossStat: {
        deleteMany: { raidId, type: raidDetailUpsertDto.mode },
        createMany: {
          data: raidDetailUpsertDto.effects.map((stat) => ({
            statId: stat.id,
            value: stat.stat_value,
            type: raidDetailUpsertDto.mode,
          })),
        },
      },
    };
    this.logger.info({ raidId }, 'start detail upsert raid succeeded');
    return this.raidRepository.upsertRaidDetil(raidId, raidDetailData);
  }

  /**
   * 레이드 타이틀 생성
   * @param raidTitleCreateDto
   * @returns
   */
  async createRaidTitle(
    raidTitleCreateDto: RaidTitleCreateDto,
  ): Promise<RaidTitle> {
    this.eventEmitter.emit(RaidUpdatedEvent.name);
    return await this.raidRepository.createRaidTitle(raidTitleCreateDto.title);
  }
}
