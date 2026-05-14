import { Expose } from 'class-transformer';

export class EnchantEffectDto {
  @Expose()
  stat_name!: string;

  @Expose()
  stat_value!: string;
}
