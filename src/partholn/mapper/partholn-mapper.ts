import { PartholnWithRelations } from '../repository/partholn.repository';

export class PartholnMapper {
  static toResponse(partholn: PartholnWithRelations[]) {
    return partholn.map((p) => {
      return {
        name: p?.name,
        rank: p?.rank,
        affix: p?.affix.value,
        effects: p?.effects?.map((e) => {
          return {
            stat_name: e?.stat.name,
            stat_value: e?.value,
          };
        }),
      };
    });
  }
}
