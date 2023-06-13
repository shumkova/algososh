// Проверьте, что если в инпуте пусто, то кнопка добавления недоступна.
// Проверьте правильность добавления элемента в стек. Важно убедиться, что цвета элементов меняются и каждый шаг анимации отрабатывает корректно.
// Проверить правильность удаления элемента из стека.
// Проверьте поведение кнопки «Очистить». Добавьте в стек несколько элементов, по нажатию на кнопку «Очистить» длина стека должна быть равна 0.

import { SHORT_DELAY_IN_MS } from "../../src/constants/delays";
import {
  catchAnimationPause,
  circleChangingStyle,
  circleDefaultStyle,
  circleSelector,
  buttonLoaderClass,
  addButtonSelector,
  deleteButtonSelector,
  clearButtonSelector
} from "./constants";

describe("stack works correctly", () => {
  const addElements = () => {
    cy.get("@input").type("1").should("have.value", "1");
    cy.get("@addButton").click();
    cy.get("@input").type("2").should("have.value", "2");
    cy.get("@addButton").click();
    cy.get("@input").type("3").should("have.value", "3");
    cy.get("@addButton").click();
  }

  beforeEach(() => {
    cy.visit("stack");
    cy.get("input[name='str']").as("input");
    cy.get(addButtonSelector).as("addButton");
    cy.get(deleteButtonSelector).as("deleteButton");
    cy.get(clearButtonSelector).as("clearButton");
  })

  it("add button should by disabled when input is empty", () => {
    cy.get("@input").should("have.value", "");
    cy.get("@addButton").should("be.disabled");
  })

  it("should add element in stack with animation", () => {
    cy.clock();
    cy.get("@input").type("1").should("have.value", "1");
    cy.get("@addButton").click();
    cy.tick(catchAnimationPause);
    cy.get(circleSelector).last().as("firstCircle").should("have.css", "border", circleChangingStyle).and("have.text", "1");
    cy.tick(SHORT_DELAY_IN_MS);
    cy.get("@firstCircle").should("have.css", "border", circleDefaultStyle);
    cy.get("@input").should("have.value", "");
    cy.get("@deleteButton").should("be.enabled");
    cy.get("@clearButton").should("be.enabled");

    cy.get("@input").type("2").should("have.value", "2");
    cy.get("@addButton").click();
    cy.tick(catchAnimationPause);
    cy.get(circleSelector).last().as("secondCircle").should("have.css", "border", circleChangingStyle).and("have.text", "2");
    cy.get("@addButton").should("have.attr", "class").and("match", buttonLoaderClass);
    cy.get("@deleteButton").should("be.disabled");
    cy.tick(SHORT_DELAY_IN_MS);
    cy.get("@secondCircle").should("have.css", "border", circleDefaultStyle);
    cy.get("@addButton").should("have.attr", "class").and("not.match", buttonLoaderClass);
    cy.get(circleSelector).should("have.length", "2");
  })

  it("should delete element with animation", () => {
    addElements();
    cy.clock();

    cy.get("@deleteButton").click();
    cy.tick(catchAnimationPause);
    cy.get(circleSelector).last().should("have.css", "border", circleChangingStyle);
    cy.get("@deleteButton").should("have.attr", "class").and("match", buttonLoaderClass);
    cy.tick(SHORT_DELAY_IN_MS);
    cy.get(circleSelector).should("have.length", "2");
    cy.get("@deleteButton").should("have.attr", "class").and("not.match", buttonLoaderClass);

    cy.get("@deleteButton").click();
    cy.tick(catchAnimationPause);
    cy.get(circleSelector).last().should("have.css", "border", circleChangingStyle);
    cy.tick(SHORT_DELAY_IN_MS);
    cy.get(circleSelector).should("have.length", "1");

    cy.get("@deleteButton").click();
    cy.tick(catchAnimationPause);
    cy.get(circleSelector).last().should("have.css", "border", circleChangingStyle);
    cy.tick(SHORT_DELAY_IN_MS);
    cy.get(circleSelector).should("have.length", "0");
  })

  it("should clear stack", () => {
    addElements();
    cy.get("@clearButton").click();
    cy.get(circleSelector).should("have.length", "0");
  })
})