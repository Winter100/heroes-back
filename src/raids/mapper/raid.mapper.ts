import {
  BossStatDto,
  RaidResponseDto,
  RaidTableResponseDto,
} from '../dto/raid-response.dto';
import { RaidWithRelations } from '../repository/raid.repository';

export class RaidMapper {
  static toBasicResponse(raid: RaidWithRelations): RaidResponseDto {
    const { entry, limit } = raid.bossStat.reduce<{
      entry: BossStatDto[];
      limit: BossStatDto[];
    }>(
      (acc, cur) => {
        const dto: BossStatDto = {
          stat_name: cur.stat.name,
          stat_value: cur.value,
        };
        if (cur.type === 'ENTRY') acc.entry.push(dto);
        else if (cur.type === 'LIMIT') acc.limit.push(dto);

        return acc;
      },
      { entry: [], limit: [] },
    );

    const reward = raid.basicClearReward.map((reward) => {
      return {
        name: reward.basicClearRewardName.name,
        value: reward.value,
      };
    });

    const { boss, image, level, bonusTargets, battle, raidTitle } = raid;

    return {
      raidTitle: raidTitle.name,
      battle,
      boss,
      level,
      image,
      entry,
      limit,
      bonus: bonusTargets,
      clear: reward,
    };
  }

  static toRaidTableResponse(raid: RaidResponseDto[]): RaidTableResponseDto[] {
    const groupRaidByTitle = raid.reduce(
      (acc, cur) => {
        const { raidTitle: raid_name, ...result } = cur;

        if (!acc[raid_name]) {
          acc[raid_name] = [];
        }

        acc[raid_name].push(result);

        return acc;
      },
      {} as Record<string, any[]>,
    );

    const raidGroup = Object.keys(groupRaidByTitle).map((title) => ({
      raid_name: title,
      monsters: groupRaidByTitle[title],
    }));

    return raidGroup;
  }
}
