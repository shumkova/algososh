import { getReversingStringSteps } from "./utils";

it("should reverse string with odd number of letters", () => {
  expect(getReversingStringSteps("12345"))
    .toEqual([
      ["1", "2", "3", "4", "5"],
      ["1", "2", "3", "4", "5"],
      ["5", "2", "3", "4", "1"],
      ["5", "4", "3", "2", "1"],
      ["5", "4", "3", "2", "1"],
    ])
});

it("should reverse string with even number of letters", () => {
  expect(getReversingStringSteps("1234"))
    .toEqual([
      ["1", "2", "3", "4"],
      ["1", "2", "3", "4"],
      ["4", "2", "3", "1"],
      ["4", "3", "2", "1"],
    ])
})

it("should reverse string with one letter", () => {
  expect(getReversingStringSteps("1"))
    .toEqual([
      ["1"],
      ["1"],
    ])
})

it("should reverse empty string", () => {
  expect(getReversingStringSteps(""))
    .toEqual([]);
})