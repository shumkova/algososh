// Список
//
// Проверьте, что если в инпуте пусто, то кнопка добавления недоступна, кнопки добавления по индексу и удаления по индексу недоступны тоже.
// Проверьте корректность:
//   - отрисовки дефолтного списка.
//   - добавления элемента в head.
//   - добавления элемента в tail.
//   - удаления элемента из head.
//   - удаления элемента из tail.
//   - добавления элемента по индексу.
//   - удаления элемента по индексу.

import {
  buttonLoaderClass,
  catchAnimationPause, circleChangingStyle,
  circleContentSelector, circleDefaultStyle,
  circleHeadSelector,
  circleIndexSelector, circleLetterSelector, circleModifiedStyle,
  circleSelector,
  circleTailSelector, smallCircle
} from "./constants";
import {DELAY_IN_MS, SHORT_DELAY_IN_MS} from "../../src/constants/delays";

const circleWrapperSelector = "[class*=vis__item]";

describe("list works correctly", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000/list");
    cy.get("input[name='value']").as("valueInput");
    cy.get("input[name='position']").as("positionInput");
    cy.get("[data-cy='addHeadButton']").as("addHeadButton");
    cy.get("[data-cy='addTailButton']").as("addTailButton");
    cy.get("[data-cy='deleteHeadButton']").as("deleteHeadButton");
    cy.get("[data-cy='deleteTailButton']").as("deleteTailButton");
    cy.get("[data-cy='addIndexButton']").as("addIndexButton");
    cy.get("[data-cy='deleteIndexButton']").as("deleteIndexButton");
  });

  it("buttons should by disabled when inputs are empty", () => {
    cy.get("@valueInput").should("have.value", "");
    cy.get("@positionInput").should("have.value", "");
    cy.get("@addHeadButton").should("be.disabled");
    cy.get("@addTailButton").should("be.disabled");
    cy.get("@addIndexButton").should("be.disabled");
    cy.get("@deleteIndexButton").should("be.disabled");
  })

  it("should render default list", () => {
    cy.get(circleContentSelector).should("have.length.of.at.least", 1).and("have.length.of.at.most", 6);
    cy.get(circleContentSelector).first().find(circleHeadSelector).should("have.text", "head");
    cy.get(circleContentSelector).last().find(circleTailSelector).should("have.text", "tail");
    cy.get(circleContentSelector).each(($el, index) => {
      cy.get($el).find(circleIndexSelector).should("have.text", index);
      cy.get($el).find(circleSelector).should("have.css", "border", circleDefaultStyle);
    })
  })

  it("should add element in head", () => {
    cy.get(circleContentSelector).its("length").then(length => {
      cy.get(circleLetterSelector).first().then($firstCircleLetter => {
        cy.clock();
        cy.get("@valueInput").type("1").should("have.value", "1");
        cy.get("@addHeadButton").should("be.enabled").click();
        cy.tick(catchAnimationPause);
        cy.get("@addHeadButton").should("have.attr", "class").and("match", buttonLoaderClass);
        cy.get(circleContentSelector).first().find(smallCircle).should("have.text", "1").and("have.css", "border", circleChangingStyle);
        cy.tick(SHORT_DELAY_IN_MS);
        cy.get(circleContentSelector).should("have.length", length + 1);
        cy.get(circleContentSelector).first().as("newHead").find(circleHeadSelector).should("have.text", "head");
        cy.get("@newHead").find(circleSelector).should("have.text", "1").and("have.css", "border", circleModifiedStyle);
        cy.get("@newHead").find(circleIndexSelector).should("have.text", "0");
        cy.get(circleContentSelector).eq(1).as("prevHead")
          .find(circleHeadSelector).should("not.have.text", "head")
          .find(circleContentSelector).should("not.exist");
        cy.get("@prevHead").find(circleSelector).should("have.text", $firstCircleLetter.text());
        cy.tick(SHORT_DELAY_IN_MS);
        cy.get(circleSelector).first().should("have.css", "border", circleDefaultStyle);

      })
    });
  })

  it("should add element in tail", () => {
    cy.get(circleContentSelector).its("length").then(length => {
      cy.get(circleLetterSelector).last().then($lastCircleLetter => {
        cy.clock();
        cy.get("@valueInput").type("10").should("have.value", "10");
        cy.get("@addTailButton").should("be.enabled").click();
        cy.tick(catchAnimationPause);
        cy.get("@addTailButton").should("have.attr", "class").and("match", buttonLoaderClass);
        cy.get(circleWrapperSelector).last().find(smallCircle).first()
          .should("have.text", "10")
          .and("have.css", "border", circleChangingStyle);
        cy.tick(SHORT_DELAY_IN_MS);
        cy.get(circleContentSelector).should("have.length", length + 1);
        cy.get(circleContentSelector).last().as("newTail").find(circleTailSelector).should("have.text", "tail");
        cy.get("@newTail").find(circleSelector)
          .should("have.text", "10")
          .and("have.css", "border", circleModifiedStyle);
        cy.get("@newTail").find(circleIndexSelector).should("have.text", `${length}`);
        cy.get(circleContentSelector).eq(length - 1).as("prevHead")
          .find(circleTailSelector).should("not.have.text", "tail")
          .find(circleContentSelector).should("not.exist");
        cy.get("@prevHead").find(circleSelector).should("have.text", $lastCircleLetter.text());
        cy.tick(SHORT_DELAY_IN_MS);
        cy.get(circleSelector).last().should("have.css", "border", circleDefaultStyle);
      })
    });
  })

  it("should remove element from head", () => {
    cy.get(circleContentSelector).its("length").then(length => {
      cy.get(circleLetterSelector).first().then(firstCircleLetter => {
        cy.clock();
        cy.get("@deleteHeadButton").should("be.enabled").click();
        cy.tick(catchAnimationPause);
        cy.get("@deleteHeadButton")
          .should("have.attr", "class")
          .and("match", buttonLoaderClass);
        cy.get(circleContentSelector).first().as("firstCircle")
          .find(circleLetterSelector).first().should("be.empty");
        cy.get("@firstCircle").find(smallCircle).last()
          .should("have.text", firstCircleLetter.text())
          .and("have.css", "border", circleChangingStyle);
        cy.tick(SHORT_DELAY_IN_MS);
        cy.get(circleContentSelector).should("have.length", length - 1);
      })
    });
  });

  it("should remove element from tail", () => {
    cy.get(circleContentSelector).its("length").then(length => {
      cy.get(circleLetterSelector).last().then(lastCircleLetter => {
        cy.clock();
        cy.get("@deleteTailButton").should("be.enabled").click();
        cy.tick(catchAnimationPause);
        cy.get("@deleteTailButton")
          .should("have.attr", "class")
          .and("match", buttonLoaderClass);
        cy.get(circleWrapperSelector).last().as("lastCircleWrapper")
          .find(circleLetterSelector).first().should("be.empty");
        cy.get("@lastCircleWrapper").find(smallCircle)
          .should("have.text", lastCircleLetter.text())
          .and("have.css", "border", circleChangingStyle);
        cy.tick(SHORT_DELAY_IN_MS);
        cy.get(circleContentSelector).should("have.length", length - 1);
      })
    });
  });

  it("should add element by index", () => {
    cy.get(circleContentSelector).its("length").then(length => {
      cy.clock();
      cy.get("@valueInput").type("3");
      cy.get("@positionInput").type(2);
      cy.get("@addIndexButton").should("be.enabled").click();
      cy.tick(catchAnimationPause);
      cy.get("@addIndexButton").should("have.attr", "class").and("match", buttonLoaderClass);
      cy.get(circleWrapperSelector).first().find(smallCircle)
        .should("have.text", "3")
        .and("have.css", "border", circleChangingStyle);
      cy.tick(SHORT_DELAY_IN_MS);
      cy.get(circleContentSelector).first().find(circleSelector).should("have.css", "border", circleChangingStyle);
      cy.get(circleContentSelector).eq(1).find(smallCircle)
        .should("have.text", "3")
        .and("have.css", "border", circleChangingStyle);
      cy.tick(DELAY_IN_MS);
      cy.tick(DELAY_IN_MS);
      cy.get(circleWrapperSelector).each(($el, elInd) => {
        if (elInd < 2) {
          cy.wrap($el).find(circleSelector).should("have.css", "border", circleChangingStyle);
        }
      })
      cy.tick(DELAY_IN_MS);
      cy.get(circleWrapperSelector).each(($el, elInd) => {
        if (elInd < 2) {
          cy.wrap($el).find(circleSelector).should("have.css", "border", circleDefaultStyle);
        }
      })
      cy.get(circleWrapperSelector).eq(2).find(smallCircle).should("not.exist");
      cy.get(circleWrapperSelector).eq(2).find(circleSelector).should("have.text", "3").and("have.css", "border", circleModifiedStyle);
      cy.tick(DELAY_IN_MS);
      cy.get(circleSelector).should("have.length", length + 1);
      cy.get(circleSelector).each(($el, elInd) => {
        cy.wrap($el).should("have.css", "border", circleDefaultStyle);
      });
      cy.get("@valueInput").should("have.value", "");
      cy.get("@positionInput").should("have.value", "");
      cy.get("@addIndexButton")
        .should("have.attr", "class")
        .and("not.match", buttonLoaderClass);
    });
  })

  it("should remove element by index", () => {
    cy.get(circleContentSelector).its("length").then(length => {
      cy.get(circleSelector).eq(2).then(targetCircle => {
        cy.clock();
        cy.get("@positionInput").type(2);
        cy.get("@deleteIndexButton").should("be.enabled").click();
        cy.tick(catchAnimationPause);
        cy.get("@deleteIndexButton").should("have.attr", "class").and("match", buttonLoaderClass);
        cy.tick(DELAY_IN_MS);
        cy.tick(DELAY_IN_MS);
        cy.tick(DELAY_IN_MS);
        cy.get(circleSelector).each(($el, elInd) => {
          if (elInd <= 2) {
            cy.wrap($el).should("have.css", "border", circleChangingStyle);
          }
        })
        cy.tick(DELAY_IN_MS);
        cy.get(circleWrapperSelector).eq(2).find(circleSelector)
          .should("have.css", "border", circleDefaultStyle)
          .and("not.have.text");
        cy.get(circleWrapperSelector).eq(2).find(smallCircle)
          .should("have.text", targetCircle.text())
          .and("have.css", "border", circleChangingStyle);
        cy.tick(DELAY_IN_MS);
        cy.get(circleSelector).should("have.length", length - 1);
        cy.get(circleSelector).each(($el, elInd) => {
          cy.wrap($el).should("have.css", "border", circleDefaultStyle);
        });
        cy.get("@valueInput").should("have.value", "");
        cy.get("@positionInput").should("have.value", "");
        cy.get(smallCircle).should("not.exist");
        cy.get("@deleteIndexButton")
          .should("have.attr", "class")
          .and("not.match", buttonLoaderClass);
      })
    });
  })
});