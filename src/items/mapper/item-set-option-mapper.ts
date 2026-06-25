import { ItemSetWithRelations } from '../repository/item.repository';

type ItemBonus = {
  level: number;
  stat_bonus: { stat_name: string; stat_value: number }[];
};

type ItemSlot = {
  item_name: string;
  item_slot: string;
};

type ItemSetType = {
  item_set_name: string;
  item_set_slot: ItemSlot[];
  item_set_list: string[];
  item_set_bonus: ItemBonus[];
};

export class ItemSetOptionMapper {
  static toResponse(itemSetOption: ItemSetWithRelations[]): ItemSetType[] {
    return itemSetOption.map((itemSet) => {
      const grouped = itemSet.itemSetBonus.reduce<Record<number, ItemBonus>>(
        (acc, cur) => {
          const currentLevel = cur.level.level;

          if (!acc[currentLevel]) {
            acc[currentLevel] = {
              level: currentLevel,
              stat_bonus: [],
            };
          }

          acc[currentLevel].stat_bonus.push({
            stat_name: cur.stat.name,
            stat_value: cur.statValue,
          });

          return acc;
        },
        {},
      );
      return {
        item_set_name: itemSet.name,
        item_set_slot: itemSet.itemSetSlotList.map((slot) => ({
          item_name: slot.slot.name,
          item_slot: slot.slot.value,
        })),
        item_set_list: itemSet.itemSetList.map((item) => item.item.name),
        item_set_bonus: Object.values(grouped),
      };
    });
  }
}
