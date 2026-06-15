import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  Post,
  SerializeOptions,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImageValidationPipe } from './pipes/image-validation.pipe';
import { CharactersService } from './characters.service';
import { ClassResponseDto } from './dto/class-response.dto';
import { CharacterClassCreateDto } from './dto/character-class-create.dto';
import { CharacterClassResponseDto } from './dto/character-class-response.dto';
import { CreateSkillDto } from './dto/create-skill.dto';
import { UserRole } from '@prisma/client';
import { Roles } from '../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-token.guard';
import { RolesGuard } from '../common/guards/roles.guard';

@UseInterceptors(ClassSerializerInterceptor)
@SerializeOptions({ excludeExtraneousValues: true })
@Controller('characters')
export class CharactersController {
  constructor(private charactersService: CharactersService) {}

  @Roles(UserRole.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UseInterceptors(FileInterceptor('image'))
  @Post()
  async createClassProfile(
    @Body() createClassDto: CharacterClassCreateDto,
    @UploadedFile(ImageValidationPipe) image: Express.Multer.File,
  ): Promise<CharacterClassResponseDto> {
    return await this.charactersService.createClassProfile(
      createClassDto,
      image,
    );
  }

  @Roles(UserRole.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UseInterceptors(FileInterceptor('image'))
  @Post('skill')
  async createClassSkill(
    @Body() createSkillDto: CreateSkillDto,
    @UploadedFile(ImageValidationPipe) image: Express.Multer.File,
  ) {
    return await this.charactersService.createClassSkill(createSkillDto, image);
  }

  // 해당 직업과 모든 스킬 반환
  @Get(':className')
  async findSkillsByClassName(
    @Param() params: { className: string },
  ): Promise<ClassResponseDto> {
    return await this.charactersService.findSkillsByClassName(params.className);
  }
}
