import { EventEmitter2 } from 'eventemitter2';
import { CreateSkillDto } from './../dto/create-skill.dto';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { BUCKET_NAME } from 'src/supabase/constant/bucket';
import { ImageUploadService } from 'src/supabase/imageUpload.service';
import { CharacterRepository } from '../repository/character.repository';
import { CreateClassDto } from '../dto/character-class-create.dto';
import { CharacterClassResponseDto } from '../dto/character-class-response.dto';
import { plainToInstance } from 'class-transformer';
import { UpdateClassDto } from '../dto/character-class-update.dto';
import { UpdateSkillDto } from '../dto/update-skill.dto';
import { DisconnectClassSkill } from '../dto/disconnect-class-skill.dto';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { CharacterUpdatedEvent } from '../event/character-updated.event';

@Injectable()
export class CharactersAdminService {
  constructor(
    @InjectPinoLogger(CharactersAdminService.name)
    private readonly logger: PinoLogger,
    private readonly imageUploadService: ImageUploadService,
    private readonly characterRepository: CharacterRepository,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  /**
   * 직업 생성
   * @param createClassDto
   * @param image
   * @returns
   */
  async createClassProfile(
    createClassDto: CreateClassDto,
    image?: Express.Multer.File,
  ): Promise<CharacterClassResponseDto> {
    this.logger.info({ class: createClassDto }, 'create class start');
    const findClass = await this.characterRepository.findOneClassByName(
      createClassDto.name,
    );

    if (findClass) {
      throw new BadRequestException('이미 존재하는 캐릭터 입니다');
    }

    const imageUrl: string | undefined = image
      ? await this.imageUploadService.uploadImage(image, BUCKET_NAME.characters)
      : undefined;

    const response = await this.characterRepository.createClassProfile(
      createClassDto,
      imageUrl,
    );

    if (!response) {
      throw new BadRequestException(
        `${createClassDto.name}의 생성에 실패했습니다.`,
      );
    }
    this.logger.info({ class: response }, 'create class succeeded');
    this.eventEmitter.emit(CharacterUpdatedEvent.name);
    return plainToInstance(CharacterClassResponseDto, response);
  }

  /**
   * 직업 수정
   * @param updateClassDto
   * @param image
   * @returns
   */
  async updateClassProfile(
    updateClassDto: UpdateClassDto,
    classId: number,
    image?: Express.Multer.File,
  ) {
    this.logger.info({ class: updateClassDto }, 'update class start');
    const findClass = await this.characterRepository.findOneClass(classId);

    if (!findClass)
      throw new NotFoundException(`직업 아이디 ${classId}를 찾을 수 없습니다`);

    const imageUrl: string | undefined = image
      ? await this.imageUploadService.uploadImage(image, BUCKET_NAME.characters)
      : undefined;

    try {
      const updateClass = await this.characterRepository.updateClassProfile(
        updateClassDto,
        classId,
        imageUrl,
      );

      if (imageUrl && findClass.image) {
        await this.imageUploadService.deleteImage(findClass.image);
      }

      this.logger.info({ class: updateClass }, 'update class succeeded');
      this.eventEmitter.emit(CharacterUpdatedEvent.name);

      return updateClass;
    } catch (error) {
      this.eventEmitter.emit(CharacterUpdatedEvent.name);
      throw new BadRequestException(
        error instanceof Error ? error.message : error,
      );
    }
  }

  /**
   * 직업 삭제
   * @param classId
   * @returns
   */
  async deleteClassProfile(classId: number) {
    const data = await this.characterRepository.deleteClassProfile(classId);
    this.eventEmitter.emit(CharacterUpdatedEvent.name);
    return data;
  }

  /**
   * 직업 스킬 생성
   * @param createSkillDto
   * @param image
   * @returns
   */
  async createClassSkill(
    createSkillDto: CreateSkillDto,
    image?: Express.Multer.File,
  ) {
    this.logger.info(
      { skillName: createSkillDto.name, classId: createSkillDto.classIds },
      'create class skill start',
    );
    const findSkill = await this.findOneSkillByName(createSkillDto.name);

    if (findSkill)
      throw new BadRequestException(
        `${findSkill.name}이 이미 존재합니다. 수정을 이용하세요`,
      );

    const imageUrl: string | undefined = image
      ? await this.imageUploadService.uploadImage(image, BUCKET_NAME.skills)
      : undefined;

    const createdSkill =
      await this.characterRepository.createSkillCombineClassId(
        createSkillDto,
        imageUrl,
      );

    this.logger.info(
      { skillName: createSkillDto.name, classId: createSkillDto.classIds },
      'create class skill succeeded',
    );

    this.eventEmitter.emit(CharacterUpdatedEvent.name);
    return createdSkill;
  }

  /**
   * 직업 스킬 수정
   * @param updateSkillDto
   * @param image
   * @returns
   */
  async updateClassSkill(
    updateSkillDto: UpdateSkillDto,
    skillId: number,
    image?: Express.Multer.File,
  ) {
    this.logger.info(
      {
        skillId,
        skillName: updateSkillDto.name,
        classId: updateSkillDto.classIds,
      },
      'update class skill start',
    );
    const skill = await this.findOneSkillById(skillId);
    if (!skill)
      throw new NotFoundException(`skillId: ${skillId}가 존재하지 않습니다.`);

    const imageUrl: string | undefined = image
      ? await this.imageUploadService.uploadImage(image, BUCKET_NAME.skills)
      : undefined;

    try {
      const updateClassSkill =
        await this.characterRepository.updateSkillCombineClassId(
          updateSkillDto,
          skillId,
          imageUrl,
        );

      if (skill.image && imageUrl) {
        await this.imageUploadService.deleteImage(skill.image);
      }

      this.logger.info(
        {
          skillId,
          skillName: updateSkillDto.name,
          classId: updateSkillDto.classIds,
        },
        'update class skill succeeded',
      );
      return updateClassSkill;
    } catch (error) {
      if (imageUrl) await this.imageUploadService.deleteImage(imageUrl);
      throw new BadRequestException(
        error instanceof Error ? error.message : error,
      );
    }
  }

  /**
   * 직업 스킬 삭제
   * 1. CharacterSkill Table에서 직업과 스킬의 관계만 끊음
   * 2. 실제 스킬 데이터는 Skill Table에 남아있음
   * @param connectClassSkill
   * @param skillId
   * @returns
   */
  async deleteClassSkill(
    connectClassSkill: DisconnectClassSkill,
    skillId: number,
  ) {
    this.logger.info(
      { skillId, classId: connectClassSkill.classId },
      'delete class skill start',
    );
    const connectedCharacterSkill =
      await this.characterRepository.findConnectClassSkill(
        connectClassSkill.classId,
        skillId,
      );
    if (!connectedCharacterSkill)
      throw new NotFoundException('스킬을 찾을 수 없습니다.');

    const data = await this.characterRepository.disconnectClassSkill(
      connectedCharacterSkill.id,
    );
    this.logger.info(
      { skillId, classId: connectClassSkill.classId },
      'delete class skill succeeded',
    );
    this.eventEmitter.emit(CharacterUpdatedEvent.name);
    return data;
  }

  /**
   * 스킬 이름으로 스킬찾기
   * @param skillName
   * @returns
   */
  async findOneSkillByName(skillName: string) {
    return await this.characterRepository.findOneSkillByName(skillName);
  }
  /**
   * 스킬 아이디로 스킬찾기
   * @param skillId
   * @returns
   */
  async findOneSkillById(skillId: number) {
    return await this.characterRepository.findOneSkillById(skillId);
  }
}
