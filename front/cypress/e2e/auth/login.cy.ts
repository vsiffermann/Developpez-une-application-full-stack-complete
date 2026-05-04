describe('Login', () => {
  beforeEach(() => {
    cy.visit('/login');
  });

  it('should display the login form', () => {
    cy.get('input[formControlName="identifier"]').should('exist');
    cy.get('input[formControlName="password"]').should('exist');
    cy.get('button[type="submit"]').should('exist');
  });

  it('should login with email and redirect to feed', () => {
    cy.get('input[formControlName="identifier"]').type('alice@example.com', { force: true });
    cy.get('input[formControlName="password"]').type('Test@1234', { force: true });
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/feed');
  });

  it('should login with username and redirect to feed', () => {
    cy.get('input[formControlName="identifier"]').type('alice', { force: true });
    cy.get('input[formControlName="password"]').type('Test@1234', { force: true });
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/feed');
  });

  it('should show an error for wrong password', () => {
    cy.get('input[formControlName="identifier"]').type('alice@example.com', { force: true });
    cy.get('input[formControlName="password"]').type('mauvais-mot-de-passe', { force: true });
    cy.get('button[type="submit"]').click();
    cy.get('.server-error').should('be.visible');
    cy.url().should('include', '/login');
  });
});
