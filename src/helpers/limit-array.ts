// tslint:disable-next-line:no-any
export function limitArray(arr: any[], limit: number) {
  if (!Array.isArray(arr)) {
    return [];
  }
  return arr.slice(0, limit);
}