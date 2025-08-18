import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  Post,
  SerializeOptions,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImageValidationPipe } from './pipes/image-validation.pipe';
import { CharactersService } from './characters.service';
import { ClassResponseDto } from './dto/class-response.dto';
import { CharacterClassCreateDto } from './dto/character-class-create.dto';
import { CharacterClassResponseDto } from './dto/character-class-response.dto';

@Controller('characters')
@UseInterceptors(ClassSerializerInterceptor)
@SerializeOptions({ excludeExtraneousValues: true })
export class CharactersController {
  constructor(private charactersService: CharactersService) {}

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  async createClassProfile(
    @Body() createClassDto: CharacterClassCreateDto,
    @UploadedFile(ImageValidationPipe) file: Express.Multer.File,
  ): Promise<CharacterClassResponseDto> {
    return await this.charactersService.createClassProfile(
      createClassDto,
      file,
    );
  }

  // 해당 직업과 모든 스킬 반환
  @Get(':className')
  async findSkillsByClassName(
    @Param() params: { className: string },
  ): Promise<ClassResponseDto> {
    return await this.charactersService.findSkillsByClassName(params.className);
  }
}
