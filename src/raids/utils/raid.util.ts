import { RaidTableResponseDto } from '../dto/raid-response.dto';

export const raidSort = (
  raid: RaidTableResponseDto[],
): RaidTableResponseDto[] => {
  return [...raid].sort((a, b) => {
    const indexA = raidSortKey.indexOf(a.raid_name);
    const indexB = raidSortKey.indexOf(b.raid_name);

    const posA = indexA === -1 ? Infinity : indexA;
    const posB = indexB === -1 ? Infinity : indexB;

    return posA - posB;
  });
};

export const raidSortKey = [
  '아르드리',
  '오르나',
  '와드네',
  '에리우',
  '스페셜 전투',
  '시공간 왜곡',
  '결사대',
  '결사대 [헬]',
];
