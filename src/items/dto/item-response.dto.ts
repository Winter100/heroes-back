import { Category, Item, ItemTier } from '@prisma/client';
import { Exclude, Expose, Transform } from 'class-transformer';

type ItemWithRelations = Item & {
  category: Category;
  tier: ItemTier;
};

export class ItemResponseDto {
  @Expose()
  id!: number;
  @Expose()
  name!: string;
  @Expose()
  description!: string | null;
  @Expose()
  image!: string;

  @Expose()
  @Transform(({ obj }: { obj: ItemWithRelations }) => obj.category.name)
  category!: string;

  @Expose()
  @Transform(({ obj }: { obj: ItemWithRelations }) => obj.tier.name)
  tier!: string;

  @Exclude()
  categoryId!: number;

  @Exclude()
  tierId!: number;
}
