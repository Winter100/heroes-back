import { GrindWithRelations } from '../repository/item.repository';

export type GrindResponse = {
  title: string;
  item: GrindItemResponse[];
};

type GrindItemResponse = {
  item_slot: string[];
  item_value: GrindItemValueResponse[];
};

type GrindItemValueResponse = {
  stat_name: string;
  stat_one_value: number;
  stat_max_value: number;
  one_ingredient: {
    name: string;
    image: string;
    quantity: number;
  }[];
};

export class GrindMapper {
  static toResponse(grindList: GrindWithRelations[]): GrindResponse[] {
    const map = new Map<string, GrindResponse>();

    for (const grind of grindList) {
      const title = grind.title.name;
      let group = map.get(title);

      if (!group) {
        group = {
          title,
          item: [],
        };
        map.set(title, group);
      }

      const itemSlot = grind.grindSlot.map((slot) => slot.slot.value);
      const itemKey = this.getSlotKey(itemSlot);
      let item = group.item.find(
        (item) => this.getSlotKey(item.item_slot) === itemKey,
      );

      if (!item) {
        item = {
          item_slot: itemSlot,
          item_value: [],
        };
        group.item.push(item);
      }

      const itemValue = {
        stat_name: grind.stat.name,
        stat_one_value: grind.statOneValue,
        stat_max_value: grind.statMaxValue,
        one_ingredient: grind.grindIngredient.map((ingredient) => ({
          name: ingredient.item.name,
          image: ingredient.item.image ?? '',
          quantity: ingredient.quantity,
        })),
      };
      const valueKey = this.getItemValueKey(itemValue);
      const hasSameValue = item.item_value.some(
        (value) => this.getItemValueKey(value) === valueKey,
      );

      if (!hasSameValue) {
        item.item_value.push(itemValue);
      }
    }

    return [...map.values()];
  }

  private static getSlotKey(slots: string[]): string {
    return [...slots].sort().join('|');
  }

  private static getItemValueKey(value: GrindItemValueResponse): string {
    const ingredientKey = value.one_ingredient
      .map((ingredient) => `${ingredient.name}:${ingredient.quantity}`)
      .sort()
      .join('|');

    return [
      value.stat_name,
      value.stat_one_value,
      value.stat_max_value,
      ingredientKey,
    ].join('|');
  }
}
