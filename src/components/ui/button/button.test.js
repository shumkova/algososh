import React from "react";
import renderer from "react-test-renderer";
import { render, screen, fireEvent } from "@testing-library/react";

import {Button} from "./button";

it("Кнопка с текстом", () => {
  const tree = renderer
    .create(<Button text={"Кнопка"}/>)
    .toJSON()
  expect(tree).toMatchSnapshot();
})

it("Кнопка без текста", () => {
  const tree = renderer
    .create(<Button/>)
    .toJSON()
  expect(tree).toMatchSnapshot();
});

it("Заблокированная кнопка", () => {
  const tree = renderer
    .create(<Button disabled/>)
    .toJSON()
  expect(tree).toMatchSnapshot();
})

it("Кнопка с индикацией загрузки", () => {
  const tree = renderer
    .create(<Button isLoader/>)
    .toJSON()
  expect(tree).toMatchSnapshot();
})

it("Нажатие на кнопку вызывает корректный alert", () => {
  window.alert = jest.fn();
  const onClick = () => {window.alert("click")};

  render(<Button onClick={onClick}/>);
  const btn = screen.getByRole("button");
  fireEvent.click(btn);
  expect(window.alert).toHaveBeenCalledWith("click");

})



