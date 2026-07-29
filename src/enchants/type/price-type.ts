export interface ItemPriceType {
  date_update: string;
  item_name: string;
  average_price: number;
  min_price: number;
  max_price: number;
  item_option: {
    enhancement_level: number;
    tuning_stat: [
      {
        stat_name: string;
        stat_value: string;
      },
    ];
    ability_name: string;
    prefix_enchant_preset_1: string;
    suffix_enchant_preset_1: string;
    prefix_enchant_preset_2: string;
    suffix_enchant_preset_2: string;
    power_infusion_preset_1: [
      {
        stat_name: string;
        stat_value: string;
      },
    ];
    power_infusion_preset_2: [
      {
        stat_name: string;
        stat_value: string;
      },
    ];
    bind_release_limit: string;
    item_shape_name: string;
    item_quality: string;
    bracelet_gem_composite: [
      {
        item_name: string;
        stat: [
          {
            stat_name: string;
            stat_value: string;
          },
        ];
      },
    ];
    value: string;
  };
}

export interface ItemPriceApiType {
  next_cursor: string;
  item: ItemPriceType[];
}

export type SIMULATION_AFFIX_TYPE = (typeof SIMULATION_AFFIX_PART)[number];

export const SIMULATION_AFFIX_PART = [
  'prefix',
  'suffix',
  'infusion',
  'partholn',
  'grind',
] as const;

export interface EnchantFormatingType {
  item_name: string;
  min_price: number;
  max_price: number;
  average_price: number;
  date_update: string;
  affix: SIMULATION_AFFIX_TYPE;
}
