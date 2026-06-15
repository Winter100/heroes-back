import { EnchantWithRelations } from './../repository/enchant.respository';
import { Exclude, Expose, Transform } from 'class-transformer';

// Todo: Mapper 형식으로 변환하기
@Exclude()
export class EnchantResponseDto {
  @Expose()
  name!: string;

  @Expose()
  @Transform(
    ({ obj }: { obj: EnchantWithRelations }) => {
      return obj.rank?.name;
    },
    { toClassOnly: true },
  )
  rank!: string;

  @Expose()
  @Transform(
    ({ obj }: { obj: EnchantWithRelations }) => {
      return obj.affix?.value;
    },
    { toClassOnly: true },
  )
  affix!: string;

  @Expose()
  @Transform(
    ({ obj }: { obj: EnchantWithRelations }) => {
      if (!obj.enchantSlot) return [];
      return obj.enchantSlot.map((es) => es.slot).filter(Boolean);
    },
    { toClassOnly: true },
  )
  slot!: Array<{ name: string; value: string }>;

  @Expose()
  @Transform(
    ({ obj }: { obj: EnchantWithRelations }) => {
      if (!obj.effects) return [];
      return obj.effects.map((effect) => ({
        stat_name: effect.stat?.name,
        stat_value: effect.value,
      }));
    },
    { toClassOnly: true },
  )
  effects!: Array<{
    stat_name: string;
    stat_value: string;
  }>;
}

export class EnchantDropResponseDto extends EnchantResponseDto {
  drop!: Array<{
    name: string;
    image: string;
    type: 'raid' | 'item';
  }>;
}
