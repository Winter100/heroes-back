import { Expose } from 'class-transformer';

export class BossStatDto {
  stat_name!: string;
  stat_value!: number;
  image?: string;
}

class BonusTargetsDto {
  bonus!: string;
  value!: string;
}

class BasicClearRewardDto {
  name!: string;
  value!: number;
}

export class RaidResponseDto {
  battle!: string;
  boss!: string;
  image!: string | null;
  level!: number;
  raidTitle!: string;
  entry!: BossStatDto[];
  limit!: BossStatDto[];
  bonus!: BonusTargetsDto[];
  clear!: BasicClearRewardDto[];
}
export class RaidTableResponseDto {
  @Expose()
  raid_name!: string;

  @Expose()
  monsters!: RaidResponseDto[];
}
