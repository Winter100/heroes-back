import { ItemWithRelations } from '../repository/item.repository';

export class ItemMapper {
  static toAllItemResponse(items: ItemWithRelations[]) {
    return items.map((item) => ({
      id: item.id,
      name: item.name,
      image: item.image,
      category: item.category.name,
      tier: item.tier.name,
    }));
  }
}
