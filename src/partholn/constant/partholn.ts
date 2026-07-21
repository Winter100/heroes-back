import { AffixType } from '@prisma/client';

export interface PartholnType {
  name: number;
  rank: number;
  affix: AffixType;
  effects: {
    stat_name: string;
    stat_value: string;
  }[];
}
