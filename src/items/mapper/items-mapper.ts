import {
  ItemStepWithRelations,
  ItemWithRelations,
} from '../repository/item.repository';

export class ItemMapper {
  static toItemDetail(item: ItemWithRelations) {
    return { ...item };
  }
  static toDetailStep(item: ItemStepWithRelations) {
    return {
      id: item.id,
      name: item.name,
      image: item.image,
      description: item.description,
      category: item.category,
      tier: item.tier,
      slot: item.slot,
      slotId: item.slotId,
      steps: [...item.equipmentStep]
        .map((step) => ({
          id: step.id,
          stepName: step.stepName,
          effects: step.stats.map((stat) => ({
            name: stat.stat.name,
            stat_id: stat.stat.id,
            stat_value: stat.value,
          })),
        }))
        .sort((a, b) => {
          const priorityA = getSortPriority(a.stepName);
          const priorityB = getSortPriority(b.stepName);
          if (priorityA === priorityB) {
            return a.stepName.localeCompare(b.stepName, undefined, {
              numeric: true,
            });
          }
          return priorityA - priorityB;
        }),
    };
  }
}

const TIER_ORDER = ['일반', '초급', '중급', '고급', '레어', '전설'];

function getSortPriority(stepName: string): number {
  const match = stepName.match(/\d+/);
  if (match) {
    return parseInt(match[0], 10);
  }

  const index = TIER_ORDER.indexOf(stepName);
  if (index !== -1) {
    return 100 + index;
  }

  return 999;
}
