import { ItemRecipeResponseArray } from '../type/item-type';

const PREFIX_PRIORITY = {
  '': 0,
  초급: 1,
  중급: 2,
  고급: 3,
  레어: 4,
  전설: 5,
};

const PREFIXES = Object.keys(PREFIX_PRIORITY).filter((p) => p !== '');

const parseGameItem = (name: string) => {
  const isSpecial = name.includes('와드네') || name.includes('에리우');

  if (!isSpecial) {
    return { isSpecial: false, baseName: name, priority: Infinity };
  }

  const firstWord = name.split(' ')[0];
  const hasPrefix = PREFIXES.includes(firstWord);

  const prefix = hasPrefix ? firstWord : '';
  const baseName = hasPrefix ? name.replace(`${firstWord} `, '') : name;
  const priority = PREFIX_PRIORITY[prefix as keyof typeof PREFIX_PRIORITY] ?? 0;

  return { isSpecial: true, baseName, priority };
};

// 1. 부위별 우선순위를 명시적인 배열로 선언 (인덱스가 작을수록 우선순위가 높음)
const PARTS_ORDER = ['무기', '헬름', '메일', '그리브즈', '건틀릿', '부츠'];

// 2. 아이템 이름이나 baseName을 받아 부위 점수를 반환하는 헬퍼 함수
const getPartsPriority = (name: string): number => {
  const index = PARTS_ORDER.findIndex((part) => name.includes(part));

  // 배열에 없는 부위(예: 악세서리, 반지 등)는 가장 뒤로 보냄 (큰 숫자 부여)
  return index === -1 ? PARTS_ORDER.length : index;
};

export const sortRecipe = (
  items: ItemRecipeResponseArray,
): ItemRecipeResponseArray => {
  return items.sort((a, b) => {
    const itemA = parseGameItem(a.name);
    const itemB = parseGameItem(b.name);

    // 규칙 1: 특수 아이템 그룹을 일반 아이템보다 무조건 앞으로
    if (itemA.isSpecial !== itemB.isSpecial) {
      return itemA.isSpecial ? -1 : 1;
    }

    // 둘 다 특수 아이템인 경우
    if (itemA.isSpecial && itemB.isSpecial) {
      // [추가된 규칙]: 무기, 헬름, 메일, 그리브즈, 건틀릿, 부츠 순서로 먼저 정렬
      const partPriorityA = getPartsPriority(itemA.baseName);
      const partPriorityB = getPartsPriority(itemB.baseName);

      if (partPriorityA !== partPriorityB) {
        return partPriorityA - partPriorityB; // 점수가 낮은(우선순위가 높은) 것이 앞으로
      }

      // 규칙 2: 부위 순서가 같다면(예: 둘 다 그리브즈), 진짜 아이템 종류(baseName)가 같은지 비교
      if (itemA.baseName !== itemB.baseName) {
        return itemA.baseName.localeCompare(itemB.baseName, 'ko');
      }

      // 규칙 3: 아이템 종류까지 완벽히 일치한다면, 그 안에서 등급 순서대로 세웁니다.
      return itemA.priority - itemB.priority;
    }

    // 둘 다 일반 아이템인 경우 가나다순 정렬
    return a.name.localeCompare(b.name, 'ko');
  });
};
