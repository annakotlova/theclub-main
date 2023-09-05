export function objectFilter(obj: Record<string, any>, predicate: any) {
  let result = {} as Record<string, any>,
    key;

  for (key in obj) if (obj.hasOwnProperty(key) && predicate(obj[key])) result[key] = obj[key];
  return result;
}
