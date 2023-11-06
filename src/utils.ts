export function profile<T>(
  name: string,
  enabled: boolean | undefined,
  cb: () => T
) {
  if (!enabled) return cb();
  console.time(name);
  const res = cb();
  console.timeEnd(name);
  return res;
}
