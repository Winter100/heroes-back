import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CharacterClassCreateDto } from './dto/character-class-create.dto';
import { ClassResponseDto } from './dto/class-response.dto';
import { CharacterRepository } from './repository/character.repository';
import { CharacterClassResponseDto } from './dto/character-class-response.dto';
import { plainToInstance } from 'class-transformer';
import { CreateSkillDto } from './dto/create-skill.dto';
import { ImageUploadService } from '../supabase/imageUpload.service';
import { BUCKET_NAME } from 'src/supabase/constant/bucket';

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
      BUCKET_NAME.characters,
    );

    const response = await this.characterRepository.createClassProfile(
      clasName,
      imageUrl,
    );

    if (!response)
      throw new BadRequestException(`${clasName}의 생성에 실패했습니다.`);

    return plainToInstance(CharacterClassResponseDto, response);
  }

  async createClassSkill(
    createSkillDto: CreateSkillDto,
    image: Express.Multer.File,
  ) {
    const { className, description, name: skillName } = createSkillDto;

    const imageUrl = await this.imageUploadService.uploadImage(
      image,
      BUCKET_NAME.skills,
    );
    const skill = await this.characterRepository.createSkill(
      skillName,
      description,
      imageUrl,
    );

    await this.characterRepository.createClassSkill(className, skill.id);

    return [];
  }

  async getCharacterImage() {
    const characters = await this.characterRepository.getCharacterImage();

    if (!characters) throw new NotFoundException(`캐릭터 정보가 없습니다.`);

    return characters;
  }

  async findSkillsByClassName(className: string): Promise<ClassResponseDto> {
    const result =
      await this.characterRepository.findSkillsByClassName(className);

    if (!result) throw new NotFoundException(`${className} 정보가 없습니다.`);

    const response = {
      skills: result.characterSkill.map((skill) => skill.skill),
    };

    return plainToInstance(ClassResponseDto, response);
  }
}
