import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class ImageValidationPipe implements PipeTransform {
  transform(file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('이미지 파일이 필요합니다.');
    }

    if (!/(jpg|jpeg|png|webp)$/i.test(file.originalname)) {
      throw new BadRequestException('허용되지 않은 이미지 형식입니다.');
    }

    return file;
  }
}
