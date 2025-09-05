export class EnchantResponseDto {
  name: string;
  rank: string;
  affix: string;
  slot: Array<{ name: string; value: string }>;
  effects: Array<{
    stat_name: string;
    stat_value: string;
  }>;
}

export class EnchantDropResponseDto extends EnchantResponseDto {
  drop: Array<{
    name: string;
    image: string;
    type: 'raid' | 'item';
  }>;
}
