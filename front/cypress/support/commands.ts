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

// alice est abonnée à JavaScript et Python — elle a des articles dans le feed
Cypress.Commands.add('loginAsTestUser', () => {
  cy.login('alice@example.com', 'Test@1234');
});
