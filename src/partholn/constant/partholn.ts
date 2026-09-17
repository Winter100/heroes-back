import { AffixType } from '@prisma/client';

export interface PartholnType {
  name: number;
  rank: { name: number };
  affix: { value: AffixType };
  effects: {
    stat_name: string;
    stat_value: string;
  }[];
}
