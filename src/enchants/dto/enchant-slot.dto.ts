import { Expose, Transform } from 'class-transformer';
import { EnchantWithRelations } from '../repository/enchant.respository';

type SingleSlot = EnchantWithRelations['enchantSlot'][number];

export class EnchantSlotDto {
  @Expose()
  @Transform(({ obj }: { obj: SingleSlot }) => obj.slot?.name, {
    toClassOnly: true,
  })
  name!: string;

  @Expose()
  @Transform(({ obj }: { obj: SingleSlot }) => obj.slot?.value, {
    toClassOnly: true,
  })
  value!: string;
}
