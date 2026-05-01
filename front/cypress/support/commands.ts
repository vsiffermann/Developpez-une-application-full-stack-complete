declare global {
  namespace Cypress {
    interface Chainable {
      login(identifier: string, password: string): Chainable<void>;
      loginAsTestUser(): Chainable<void>;
    }
  }
}

Cypress.Commands.add('login', (identifier: string, password: string) => {
  cy.request('POST', '/api/auth/login', { identifier, password }).then((response) => {
    localStorage.setItem('mdd_token', response.body.token);
  });
});

Cypress.Commands.add('loginAsTestUser', () => {
  cy.login('test@mdd.fr', 'Test1234!');
});
