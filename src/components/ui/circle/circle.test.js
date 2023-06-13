import React from "react";
import renderer from "react-test-renderer";

import { Circle } from "./circle";
import { ElementStates } from "../../../types/element-states";

it("Circle без букв", () => {
  const tree = renderer
    .create(<Circle />)
    .toJSON();
  expect(tree).toMatchSnapshot();
})

it("Circle с буквами", () => {
  const tree = renderer
    .create(<Circle letter={"a"}/>)
    .toJSON();
  expect(tree).toMatchSnapshot();
})

it("Circle с head", () => {
  const tree = renderer
    .create(<Circle head={"a"}/>)
    .toJSON();
  expect(tree).toMatchSnapshot();
})

it("Circle с react-элементом в head", () => {
  const tree = renderer
    .create(<Circle letter={"a"} head={<Circle letter={"b"} />}/>)
    .toJSON();
  expect(tree).toMatchSnapshot();
})

it("Circle с tail", () => {
  const tree = renderer
    .create(<Circle tail={"a"} />)
    .toJSON();
  expect(tree).toMatchSnapshot();
})

it("Circle с react-элементом в tail", () => {
  const tree = renderer
    .create(<Circle tail={<Circle letter={"b"} />} />)
    .toJSON();
  expect(tree).toMatchSnapshot();
})

it("Circle с index", () => {
  const tree = renderer
    .create(<Circle index={0}/>)
    .toJSON();
  expect(tree).toMatchSnapshot();
})

it("Circle маленький", () => {
  const tree = renderer
    .create(<Circle isSmall />)
    .toJSON();
  expect(tree).toMatchSnapshot();
})

it("Circle в состоянии default", () => {
  const tree = renderer
    .create(<Circle state={ElementStates.Default} />)
    .toJSON();
  expect(tree).toMatchSnapshot();
})

it("Circle в состоянии changing", () => {
  const tree = renderer
    .create(<Circle state={ElementStates.Changing} />)
    .toJSON();
  expect(tree).toMatchSnapshot();
})

it("Circle в состоянии modified", () => {
  const tree = renderer
    .create(<Circle state={ElementStates.Modified} />)
    .toJSON();
  expect(tree).toMatchSnapshot();
})

