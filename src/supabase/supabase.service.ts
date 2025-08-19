import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseService {
  private readonly client: SupabaseClient;

  constructor(configService: ConfigService) {
    const supabaseUrl = configService.get('SUPABASE_URL') as string;
    const key = configService.get('SUPABASE_KEY') as string;

    this.client = createClient(supabaseUrl, key);
  }

  getClient() {
    return this.client;
  }
}
