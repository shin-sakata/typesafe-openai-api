export type Repeat<
  T,
  N extends number,
  R extends unknown[] = [],
> = R["length"] extends N ? R : Repeat<T, N, [T, ...R]>;

export function repeat<T, N extends number>(value: T, n: N): Repeat<T, N> {
  return new Array(n).fill(value) as Repeat<T, N>;
}

export type NonEmptyArray<T> = [T, ...T[]];
