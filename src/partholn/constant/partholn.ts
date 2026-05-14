import { AffixType } from '@prisma/client';

export interface PartholnType {
  name: number;
  rank: number;
  affix: {
    name: string;
    value: AffixType;
  };
  effects: {
    stat_name: string;
    stat_value: string;
  }[];
}
