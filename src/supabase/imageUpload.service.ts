import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { SupabaseService } from './supabase.service';
import { toWebp } from './utils/image-processor';
import { generateFileName } from './utils/file.utils';

@Injectable()
export class ImageUploadService {
  constructor(private readonly supabaseService: SupabaseService) {}

  /**
   * 이미지는 전처리되어 webp형식으로 업로드 됩니다.
   *
   * @param file 업로드할 이미지 파일
   * @param bucket  저장할 버킷 이름
   * @returns 이미지 주소
   */

  async uploadImage(
    file: Express.Multer.File,
    bucket: string,
  ): Promise<string> {
    if (!file || !file.buffer) {
      throw new BadRequestException('파일이 존재하지 않습니다.');
    }

    const processedImageBuffer = await toWebp(file.buffer);
    const fileName = generateFileName(file.originalname);

    return this.uploadFile(
      bucket,
      fileName,
      processedImageBuffer,
      'image/webp',
    );
  }

  async deleteImage(imageUrl: string) {
    const supabase = this.supabaseService.getClient();

    const urlParts = imageUrl.split('/storage/v1/object/public/');

    if (urlParts.length < 2)
      throw new InternalServerErrorException(
        '유효하지 않은 Supabase 이미지 URL',
      );

    const [bucket, ...filePathParts] = urlParts[1].split('/');
    const filePath = filePathParts.join('/');

    if (!bucket || !filePath)
      throw new InternalServerErrorException('버킷 주소가 올바르지 않습니다');

    const { data, error } = await supabase.storage
      .from(bucket)
      .remove([filePath]);

    if (error)
      throw new InternalServerErrorException(
        '이미지 파일 삭제 중 오류가 발생했습니다.',
      );

    return data;
  }

  private async uploadFile(
    bucketName: string,
    fileName: string,
    buffer: Buffer,
    contentType: string,
  ) {
    const client = this.supabaseService.getClient();
    const { error } = await client.storage
      .from(bucketName)
      .upload(fileName, buffer, {
        cacheControl: 'max-age=31536000',
        contentType: contentType,
      });

    if (error) {
      console.log('error', error);
      throw new BadRequestException('업로드 실패');
    }

    return client.storage.from(bucketName).getPublicUrl(fileName).data
      .publicUrl;
  }
}
