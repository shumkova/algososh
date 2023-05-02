import { DELAY_IN_MS } from "../constants/delays";

export const pause = (delay = DELAY_IN_MS) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, delay);
  })
}

export const getRandomIntInclusive = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export const randomArr = (minLen: number, maxLen: number): number[] => {
  const randomLen = getRandomIntInclusive(minLen, maxLen);
  const arr: number[] = [];

  for (let i = 0; i < randomLen; i++) {
    arr.push(getRandomIntInclusive(0, 100));
  }

  return arr;
}
