import React from "react";
import { getSelectionSortSteps, getBubbleSortSteps } from "./utils";
import { Direction } from "../../types/direction";

it("should sort empty array by selection sort", () => {
  const steps = getSelectionSortSteps([], Direction.Descending);
  expect(steps[steps.length - 1].currentArray).toEqual([]);
})

it("should sort one element array by selection sort", () => {
  const steps = getSelectionSortSteps([1], Direction.Descending);
  expect(steps[steps.length - 1].currentArray).toEqual([1]);
})

it("should sort array by selection sort", () => {
  const steps = getSelectionSortSteps([1, 4, 8, 3, 0], Direction.Descending);
  expect(steps[steps.length - 1].currentArray).toEqual([8, 4, 3, 1, 0]);
})

it("should sort empty array by bubble sort", () => {
  const steps = getBubbleSortSteps([], Direction.Descending);
  expect(steps[steps.length - 1].currentArray).toEqual([]);
})

it("should sort one element array by bubble sort", () => {
  const steps = getBubbleSortSteps([1], Direction.Descending);
  expect(steps[steps.length - 1].currentArray).toEqual([1]);
})

it("should sort array by bubble sort", () => {
  const steps = getBubbleSortSteps([1, 4, 8, 3, 0], Direction.Descending);
  expect(steps[steps.length - 1].currentArray).toEqual([8, 4, 3, 1, 0]);
})