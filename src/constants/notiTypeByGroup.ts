export type NotiTypeSelectOption = {
  label: string;
  value: string | number;
};

/** Mapping Phân loại (groupType) → Loại thông báo (type) theo spec BA */
export const NOTI_TYPE_VALUES_BY_GROUP: Record<
  string,
  Array<string | number>
> = {
  account: [1, 2, 4, -1],
  finra: [0, 3, 7, 8, 9],
  market: [5, 6, '#'],
};

const MARKET_OTHER_OPTION: NotiTypeSelectOption = {
  label: 'Khác',
  value: '#',
};

export const filterNotiTypeOptionsByGroup = (
  options: NotiTypeSelectOption[],
  groupType?: string,
): NotiTypeSelectOption[] => {
  if (!groupType) return [];
  const allowed = NOTI_TYPE_VALUES_BY_GROUP[groupType];
  if (!allowed) return [];

  const allowedSet = new Set(allowed.map(String));
  const filtered = options.filter((opt) => allowedSet.has(String(opt.value)));

  if (
    options.length > 0 &&
    groupType === 'market' &&
    !filtered.some((opt) => String(opt.value) === '#')
  ) {
    return [...filtered, MARKET_OTHER_OPTION];
  }

  return filtered;
};

export const resolveTypeForGroup = (
  options: NotiTypeSelectOption[],
  groupType?: string,
  currentType?: string | number,
) => {
  const nextOptions = filterNotiTypeOptionsByGroup(options, groupType);
  const stillValid = nextOptions.some(
    (opt) => String(opt.value) === String(currentType),
  );
  if (stillValid) return currentType;
  return nextOptions[0]?.value;
};
