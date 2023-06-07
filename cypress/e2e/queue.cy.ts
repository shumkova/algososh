// Очередь
// Проверьте, что если в инпуте пусто, то кнопка добавления недоступна.
// Проверьте, правильность добавления элемента в очередь. Необходимо убедиться, что цвета элементов меняются и каждый шаг анимации отрабатывает корректно. Не забудьте проверить, что курсоры head и tail отрисовываются корректно.
// Проверить правильность удаления элемента из очереди.
// Проверьте поведение кнопки «Очистить». Добавьте в очередь несколько элементов, по нажатию на кнопку «Очистить» длина очереди должна быть равна 0.

import { SHORT_DELAY_IN_MS } from "../../src/constants/delays";
import {
  catchAnimationPause,
  circleChangingStyle,
  circleDefaultStyle,
  circleSelector,
  buttonLoaderClass,
  addButtonSelector,
  deleteButtonSelector,
  clearButtonSelector, circleContentSelector, circleHeadSelector, circleTailSelector, circleLetterSelector
} from "./constants";

describe("queue works correctly", () => {
  const addElements = () => {
    cy.clock();
    cy.get("@input").type("1");
    cy.get("@addButton").click();
    cy.tick(SHORT_DELAY_IN_MS);
    cy.get("@input").type("2");
    cy.get("@addButton").click();
    cy.tick(SHORT_DELAY_IN_MS);
    cy.get("@input").type("3");
    cy.get("@addButton").click();
    cy.tick(SHORT_DELAY_IN_MS);
  }

  const checkIfQueueIsEmpty = () => {
    cy.get(circleLetterSelector).not(":empty").should("have.length", "0");
    cy.get(circleHeadSelector).contains("head").should("have.length", "0");
    cy.get(circleTailSelector).contains("tail").should("have.length", "0");
  }

  beforeEach(() => {
    cy.visit("http://localhost:3000/queue");
    cy.get("input[name='str']").as("input");
    cy.get(addButtonSelector).as("addButton");
    cy.get(deleteButtonSelector).as("deleteButton");
    cy.get(clearButtonSelector).as("clearButton");
  })

  it("add button should by disabled when input is empty", () => {
    cy.get("@input").should("have.value", "");
    cy.get("@addButton").should("be.disabled");
  })

  it("should add element in queue with animation", () => {
    cy.get(circleContentSelector).should("have.length", "7");
    cy.clock();
    cy.get("@input").type("1").should("have.value", "1");
    cy.get("@addButton").should("be.enabled").click();

    cy.tick(catchAnimationPause);
    cy.get(circleContentSelector).first().as("firstCircleContent");
    cy.get("@firstCircleContent").children(circleSelector).as("firstCircle").should("have.text", "1").and("have.css", "border", circleChangingStyle);
    cy.get("@firstCircleContent").children(circleHeadSelector).as("firstHead").should("have.text", "head");
    cy.get("@firstCircleContent").children(circleTailSelector).as("firstTail").should("have.text", "tail");
    cy.get("@addButton").should("have.attr", "class").and("match", buttonLoaderClass);
    cy.get("@deleteButton").should("be.disabled");
    cy.get("@clearButton").should("be.disabled");

    cy.tick(SHORT_DELAY_IN_MS);
    cy.get("@input").should("have.value", "");
    cy.get("@deleteButton").should("be.enabled");
    cy.get("@clearButton").should("be.enabled");
    cy.get("@firstCircle").should("have.css", "border", circleDefaultStyle);

    cy.get("@input").type("2").should("have.value", "2");
    cy.get("@addButton").click();

    cy.tick(catchAnimationPause);
    cy.get(circleContentSelector).eq(1).as("secondCircleContent");
    cy.get("@secondCircleContent").children(circleSelector).as("secondCircle").should("have.text", "2").and("have.css", "border", circleChangingStyle);
    cy.get("@secondCircleContent").children(circleHeadSelector).as("secondHead").should("not.have.text", "head");
    cy.get("@secondCircleContent").children(circleTailSelector).as("secondTail").should("have.text", "tail");
    cy.get("@firstTail").should("not.have.text", "tail");

    cy.tick(SHORT_DELAY_IN_MS);
    cy.get("@secondCircle").should("have.css", "border", circleDefaultStyle);

    cy.get("@input").type("3").should("have.value", "3");
    cy.get("@addButton").click();
    cy.get(circleContentSelector).eq(2).as("thirdCircleContent");
    cy.get("@thirdCircleContent").children(circleSelector).as("thirdCircle").should("have.text", "3").and("have.css", "border", circleChangingStyle);
    cy.get("@thirdCircleContent").children(circleHeadSelector).as("thirdHead").should("not.have.text", "head");
    cy.get("@thirdCircleContent").children(circleTailSelector).as("thirdTail").should("have.text", "tail");
    cy.get("@secondTail").should("not.have.text", "tail");
    cy.tick(SHORT_DELAY_IN_MS);

    cy.get("@input").type("4");
    cy.get("@addButton").click();
    cy.tick(SHORT_DELAY_IN_MS);
    cy.get("@input").type("5");
    cy.get("@addButton").click();
    cy.tick(SHORT_DELAY_IN_MS);
    cy.get("@input").type("6");
    cy.get("@addButton").click();
    cy.tick(SHORT_DELAY_IN_MS);
    cy.get("@input").type("7");
    cy.get("@addButton").click();
    cy.tick(SHORT_DELAY_IN_MS);

    cy.get("@addButton").should("be.disabled");
  })

  it("should delete element with animation", () => {
    addElements();

    cy.get("@deleteButton").click();
    cy.tick(catchAnimationPause);

    cy.get("@addButton").should("be.disabled");
    cy.get("@deleteButton").should("have.attr", "class").and("match", buttonLoaderClass);
    cy.get("@clearButton").should("be.disabled");
    cy.get(circleHeadSelector).contains("head").as("currentHeadHead");
    cy.get("@currentHeadHead").parent(circleContentSelector).as("currentHeadCircleContent");
    cy.get("@currentHeadCircleContent").children(circleSelector).as("currentHeadCircle").should("have.text", "1").and("have.css", "border", circleChangingStyle);
    cy.get("@currentHeadCircleContent").children(circleTailSelector).as("currentHeadTail");

    cy.tick(SHORT_DELAY_IN_MS);

    cy.get(circleContentSelector).first().as("firstCircleContent");
    cy.get("@firstCircleContent").children(circleSelector).as("firstCircle").should("not.have.text", "1").and("have.css", "border", circleDefaultStyle);
    cy.get("@firstCircleContent").children(circleHeadSelector).as("firstHead").should("not.have.text", "head");
    cy.get(circleContentSelector).eq(1).as("secondCircleContent");
    cy.get("@secondCircleContent").children(circleSelector).as("secondCircle");
    cy.get("@secondCircleContent").children(circleHeadSelector).as("secondHead").should("have.text", "head");

    cy.get("@deleteButton").click();
    cy.tick(catchAnimationPause);
    cy.get("@currentHeadCircle").should("have.text", "2").and("have.css", "border", circleChangingStyle);

    cy.tick(SHORT_DELAY_IN_MS);
    cy.get("@secondHead").should("not.have.text", "head");
    cy.get("@secondCircle").should("not.have.text", "2").and("have.css", "border", circleDefaultStyle);
    cy.get("@currentHeadCircle").should("have.text", "3");
    cy.get("@currentHeadTail").should("have.text", "tail");

    cy.get("@deleteButton").click();
    cy.tick(catchAnimationPause);

    cy.get("@currentHeadCircle").should("have.css", "border", circleChangingStyle);

    cy.tick(SHORT_DELAY_IN_MS);

    checkIfQueueIsEmpty();
  })

  it("should clear queue", () => {
    addElements();
    cy.get("@clearButton").click();
    checkIfQueueIsEmpty();
  })
})