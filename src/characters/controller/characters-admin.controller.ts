import {
  BadRequestException,
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  SerializeOptions,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImageValidationPipe } from '../pipes/image-validation.pipe';
import { CreateClassDto } from '../dto/character-class-create.dto';
import { CreateSkillDto } from '../dto/create-skill.dto';
import { UserRole } from '@prisma/client';
import { Roles } from '../../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../../auth/guards/jwt-token.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { CharactersAdminService } from '../service/characters-adminservice';
import { UpdateClassDto } from '../dto/character-class-update.dto';
import { UpdateSkillDto } from '../dto/update-skill.dto';
import { DisconnectClassSkill } from '../dto/disconnect-class-skill.dto';

/**
 * 관리자 전용 컨트롤러
 *
 * 캐릭터 직업 관련 CRUD
 * 1. 직업 등록
 * - 직업명, 성별, 이미지, 출시일
 */
@UseInterceptors(ClassSerializerInterceptor)
@SerializeOptions({ excludeExtraneousValues: true })
// @Roles(UserRole.ADMIN)
// @UseGuards(JwtAuthGuard, RolesGuard)
@Controller('characters-admin')
export class CharactersAdminController {
  constructor(private charactersAdminService: CharactersAdminService) {}

  /* 직업 생성 */
  @UseInterceptors(FileInterceptor('image'))
  @Post()
  async createClassProfile(
    @Body() createClassDto: CreateClassDto,
    @UploadedFile(ImageValidationPipe)
    image?: Express.Multer.File,
  ) {
    return await this.charactersAdminService.createClassProfile(
      createClassDto,
      image,
    );
  }

  /* 직업 수정 */
  @UseInterceptors(FileInterceptor('image'))
  @Post('update/:classId')
  async updateClassProfile(
    @Body() updateClassDto: UpdateClassDto,
    @Param(
      'classId',
      new ParseIntPipe({
        exceptionFactory: () => {
          new BadRequestException('올바른 직업 ID를 입력해주세요');
        },
      }),
    )
    classId: number,
    @UploadedFile(ImageValidationPipe) image?: Express.Multer.File,
  ) {
    return await this.charactersAdminService.updateClassProfile(
      updateClassDto,
      classId,
      image,
    );
  }

  /* 직업 삭제 */
  @Delete(':classId')
  async deleteClassProfile(
    @Param(
      'classId',
      new ParseIntPipe({
        exceptionFactory: () => {
          new BadRequestException('올바른 직업 ID를 입력해주세요');
        },
      }),
    )
    classId: number,
  ) {
    return await this.charactersAdminService.deleteClassProfile(classId);
  }

  /* 스킬 추가 */
  @UseInterceptors(FileInterceptor('image'))
  @HttpCode(HttpStatus.NO_CONTENT)
  @Post('skill')
  async createClassSkill(
    @Body() createSkillDto: CreateSkillDto,
    @UploadedFile(ImageValidationPipe) image?: Express.Multer.File,
  ) {
    return await this.charactersAdminService.createClassSkill(
      createSkillDto,
      image,
    );
  }

  /* 스킬 수정 */
  @UseInterceptors(FileInterceptor('image'))
  @Post(`skill/update/:skillId`)
  async updateClassSkill(
    @Body() updateSkillDto: UpdateSkillDto,
    @Param(
      'skillId',
      new ParseIntPipe({
        exceptionFactory: () =>
          new BadRequestException('올바른 스킬 ID를 입력해주세요'),
      }),
    )
    skillId: number,
    @UploadedFile(ImageValidationPipe) image?: Express.Multer.File,
  ) {
    return await this.charactersAdminService.updateClassSkill(
      updateSkillDto,
      skillId,
      image,
    );
  }

  /* 스킬 삭제 (연결만 끊음) */
  @Delete('skill/delete/:skillId')
  async disconnectClassSkill(
    @Body() disconnectClassSkill: DisconnectClassSkill,
    @Param(
      'skillId',
      new ParseIntPipe({
        exceptionFactory: () =>
          new BadRequestException('올바른 스킬 ID를 입력해주세요'),
      }),
    )
    skillId: number,
  ) {
    return await this.charactersAdminService.deleteClassSkill(
      disconnectClassSkill,
      skillId,
    );
  }
}
