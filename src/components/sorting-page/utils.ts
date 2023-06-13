import {Direction} from "../../types/direction";
import {ElementStates} from "../../types/element-states";

export type TSortStep = {
  currentArray: number[],
  aIndex?: number,
  bIndex?: number,
  targetIndexes?: number[],
  sortedIndexes: number[],
}

export const swap = (arr: any[], firstIndex: number, secondIndex: number): void => {
  const temp = arr[firstIndex];
  arr[firstIndex] = arr[secondIndex];
  arr[secondIndex] = temp;
};

export const getSelectionSortSteps = (arr: number[], direction: Direction): TSortStep[] => {
  const { length } = arr;

  const steps: TSortStep[] = [{
    currentArray: [...arr],
    sortedIndexes: [],
  }]

  if (arr.length < 2) {
    return steps;
  }

  for (let i = 0; i < length - 1; i++) {
    let ind = i;

    for (let k = i + 1; k < length; k++) {
      steps.push({
        currentArray: [...arr],
        aIndex: i,
        bIndex: k,
        targetIndexes: [ind],
        sortedIndexes: [...(steps[steps.length - 1]?.sortedIndexes || [])]
      })

      if ((direction === Direction.Ascending && arr[k] < arr[ind]) ||
        (direction === Direction.Descending && arr[k] > arr[ind])) {
        ind = k;
      }
    }

    if (ind !== i) {
      steps.push({
        currentArray: [...arr],
        aIndex: i,
        targetIndexes: [ind],
        sortedIndexes: [...(steps[steps.length - 1]?.sortedIndexes || [])]
      })

      swap(arr, i, ind);
    }

    steps[steps.length - 1].sortedIndexes.push(i);

    steps.push({
      currentArray: [...arr],
      sortedIndexes: steps[steps.length - 1]?.sortedIndexes || []
    })
  }

  steps.push({
    currentArray: [...arr],
    sortedIndexes: steps[steps.length - 1]?.sortedIndexes || []
  })

  return steps;
};


export const getBubbleSortSteps = (arr: number[], direction: Direction): TSortStep[] => {
  const { length } = arr;
  const steps: TSortStep[] = [{
    currentArray: [...arr],
    sortedIndexes: []
  }]

  if (arr.length === 0) {
    return steps;
  }

  let isSwapped = false;

  for (let i = 0; i < length; i++) {
    isSwapped = false;
    for (let j = 0; j < (length - i - 1); j++) {
      steps.push({
        currentArray: [...arr],
        sortedIndexes: [...(steps[steps.length - 1]?.sortedIndexes || [])]
      })
      steps.push({
        currentArray: [...arr],
        aIndex: j,
        bIndex: j + 1,
        sortedIndexes: [...(steps[steps.length - 1]?.sortedIndexes || [])]
      })

      if ((direction === Direction.Descending && arr[j] < arr[j + 1]) ||
        (direction === Direction.Ascending && arr[j] > arr[j + 1])) {
          steps.push({
            currentArray: [...arr],
            targetIndexes: [j, j + 1],
            sortedIndexes: [...(steps[steps.length - 1]?.sortedIndexes || [])]
          })
          swap(arr, j, j + 1);
          isSwapped = true;
      }
    }

    if (!isSwapped) {
      const lastIndex = length - i - 1;
      if (steps[steps.length - 1]) {
        for (let i = lastIndex; i >= 0; i--) {
          steps[steps.length - 1].sortedIndexes.push(i);
        }
      }
    } else {
      steps[steps.length - 1]?.sortedIndexes.push(length - i - 1);
    }

    steps.push({
      currentArray: [...arr],
      sortedIndexes: steps[steps.length - 1]?.sortedIndexes || []
    })

    if (!isSwapped) {
      break;
    }
  }
  return steps;
};


export const getColumnState = (
  index: number,
  maxIndex: number,
  currentStepNumber: number,
  currentStep: TSortStep
): ElementStates => {
  if (currentStep.sortedIndexes.includes(index) || (currentStepNumber === maxIndex && maxIndex > 0)) {
    return ElementStates.Modified;
  }

  if (currentStep.targetIndexes?.includes(index)) {
    return ElementStates.Temporary;
  }
  if (currentStep.aIndex === index || currentStep.bIndex === index) {
    return ElementStates.Changing;
  }

  return ElementStates.Default;
};