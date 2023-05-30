import {ElementStates} from "../../types/element-states";

export const getReversingStringSteps = (string: string): string[][] => {
  const arr = string.split("");

  if (arr.length === 0) {
    return [];
  }

  const steps = [[...arr], [...arr]]; // сначала нужно отобразить исходную строку, а потом подсветить начало или окончание анимации перестановки

  if (arr.length < 2) {
    return steps;
  }

  let start = 0;
  let end = arr.length - 1;

  while (start <= end) {
    [arr[start], arr[end]] = [arr[end], arr[start]];
    steps.push([...arr]);
    start++;
    end--;
  }

  return steps;
};

export const getLetterState = (
  index: number,
  maxIndex: number,
  currentStep: number,
  isFinished: boolean
): ElementStates => {
  if (index < currentStep - 1 || index > maxIndex - currentStep + 1 || isFinished) {
    return ElementStates.Modified;
  }

  if (index === currentStep - 1 || index === maxIndex - currentStep + 1) {
    return ElementStates.Changing;
  }

  return ElementStates.Default
}