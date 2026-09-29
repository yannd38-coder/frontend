/// <reference types="cypress" />

Cypress.Commands.add('login', (email: string, password: string) => {
  cy.visit('/#/login');
  cy.get('input').eq(0).type(email);
  cy.get('input').eq(1).type(password);
  cy.contains('button', 'Se connecter').click();
});

declare global {
  namespace Cypress {
    interface Chainable {
      login(email: string, password: string): Chainable<void>;
    }
  }
}

export {};