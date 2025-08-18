import { ImageUploadService } from 'src/supabase/imageUpload.service';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CharacterClassCreateDto } from './dto/character-class-create.dto';
import { CHARACTER_IMAGE_BUCKET } from './constant/burket';
import { ClassResponseDto } from './dto/class-response.dto';
import { CharacterRepository } from './repository/character.repository';
import { CharacterClassResponseDto } from './dto/character-class-response.dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class CharactersService {
  constructor(
    private readonly imageUploadService: ImageUploadService,
    private readonly characterRepository: CharacterRepository,
  ) {}

  async createClassProfile(
    characterClassCreateDto: CharacterClassCreateDto,
    image: Express.Multer.File,
  ): Promise<CharacterClassResponseDto> {
    const { name: clasName } = characterClassCreateDto;

    const imageUrl = await this.imageUploadService.uploadImage(
      image,
      CHARACTER_IMAGE_BUCKET,
    );

    const response = await this.characterRepository.createClassProfile(
      clasName,
      imageUrl,
    );

    if (!response) throw new BadRequestException();

    return plainToInstance(CharacterClassResponseDto, response);
  }

  async findSkillsByClassName(className: string): Promise<ClassResponseDto> {
    const result =
      await this.characterRepository.findSkillsByClassName(className);

    if (!result) throw new NotFoundException('해당 직업 정보가 없습니다.');

    const response = {
      name: result.name,
      image: result.image,
      skills: result?.characterSkill.map((skill) => skill.skill),
    };

    return plainToInstance(ClassResponseDto, response);
  }
}
