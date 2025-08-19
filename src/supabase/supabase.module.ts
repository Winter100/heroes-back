import { Module } from '@nestjs/common';
import { SupabaseService } from 'src/supabase/supabase.service';
import { ImageUploadService } from 'src/supabase/imageUpload.service';

@Module({
  imports: [],
  controllers: [],
  providers: [SupabaseService, ImageUploadService],
  exports: [SupabaseService, ImageUploadService],
})
export class SupabaseModule {}
