import {
  addCommas as baseAddCommas,
  digitsEnToFa as baseDigitsEnToFa,
  digitsFaToEn as baseDigitsFaToEn,
} from '@persian-tools/persian-tools';

type UnaryFn<TArg, TResult> = (arg: TArg) => TResult;

const memoizeUnary = <TArg, TResult>(fn: UnaryFn<TArg, TResult>, maxSize = 5000) => {
  const cache = new Map<string, TResult>();

  return (arg: TArg) => {
    const key = `${typeof arg}:${String(arg)}`;
    const cached = cache.get(key);
    if (cached !== undefined) return cached;

    const result = fn(arg);
    cache.set(key, result);

    if (cache.size > maxSize) {
      const firstKey = cache.keys().next().value as string | undefined;
      if (firstKey) cache.delete(firstKey);
    }

    return result;
  };
};

export const addCommas = memoizeUnary(baseAddCommas);
export const digitsEnToFa = memoizeUnary(baseDigitsEnToFa);
export const digitsFaToEn = memoizeUnary(baseDigitsFaToEn);
