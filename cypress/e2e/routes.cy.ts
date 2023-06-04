describe('app routes', () => {
  before(() => {
    cy.visit('http://localhost:3000');
  })

  it('should work correctly', () => {
    cy.get('[href="/recursion"]').click();
    cy.contains('Строка');

    cy.get('[href="/"]').click();
    cy.url().should('eq', 'http://localhost:3000/');

    cy.get('[href="/fibonacci"]').click();
    cy.contains('Последовательность Фибоначчи');

    cy.get('[href="/"]').click();
    cy.url().should('eq', 'http://localhost:3000/');

    cy.get('[href="/sorting"]').click();
    cy.contains('Сортировка массива');

    cy.get('[href="/"]').click();
    cy.url().should('eq', 'http://localhost:3000/');

    cy.get('[href="/stack"]').click();
    cy.contains('Стек');

    cy.get('[href="/"]').click();
    cy.url().should('eq', 'http://localhost:3000/');

    cy.get('[href="/queue"]').click();
    cy.contains('Очередь');

    cy.get('[href="/"]').click();
    cy.url().should('eq', 'http://localhost:3000/');

    cy.get('[href="/list"]').click();
    cy.contains('Связный список');
  })
})