export function groupBy<T>(array: T[], getGroup: (item: T) => string): Record<string, T[]> {
  return groupByAndMap(array, getGroup, (item) => item);
}

export function groupByAndMap<T, V>(
  array: T[],
  getGroup: (item: T) => string,
  mapFn: (item: T) => V,
): Record<string, V[]> {
  return array.reduce(
    (result, item) => {
      const groupKey = getGroup(item);
      if (!result[groupKey]) {
        result[groupKey] = [];
      }
      result[groupKey].push(mapFn(item));
      return result;
    },
    {} as Record<string, V[]>,
  );
}
