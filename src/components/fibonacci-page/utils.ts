export const getFibonacciNumbers = (n:number): number[] => {
  let arr: number[] = [];

  for (let i = 0; i <= n; i++) {
    if (i < 2) {
      arr.push(i);
    } else {
      arr.push(arr[i - 2] + arr[i - 1]);
    }
  }

  return arr;
};