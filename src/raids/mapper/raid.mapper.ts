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
          id: cur.stat.id,
          stat_name: cur.stat.name,
          stat_value: cur.value,
          image: cur.stat.image ?? '',
        };
        if (cur.type === 'ENTRY') acc.entry.push(dto);
        else if (cur.type === 'LIMIT') acc.limit.push(dto);

        return acc;
      },
      { entry: [], limit: [] },
    );

    const reward = raid?.basicClearReward.map((reward) => {
      return {
        name: reward.basicClearRewardName.name,
        value: reward.value,
      };
    });

    const { id, boss, image, level, bonusTargets, battle, raidTitle } = raid;

    return {
      id,
      raidTitle,
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
        const { raidTitle, ...result } = cur;

        if (!acc[raidTitle.name]) {
          acc[raidTitle.name] = [];
        }

        acc[raidTitle.name].push(result);

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
