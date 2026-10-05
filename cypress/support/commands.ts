/// <reference types="cypress" />

Cypress.Commands.add('loginViaApi', (username = 'test2@test.fr', password = 'testtest') => {
  cy.session([username, password], () => {
    cy.request({
      method: 'POST',
      url: 'http://localhost:8081/login',
      body: {
        username: username,
        password: password
      }
    }).then((response) => {
      expect(response.status).to.eq(200);
      if (response.body.token) {
        window.localStorage.setItem('token', response.body.token);
      }
    });
  });
});