describe('Register', () => {
  beforeEach(() => {
    cy.visit('/register');
  });

  it('should display the register form', () => {
    cy.get('input[formControlName="username"]').should('exist');
    cy.get('input[formControlName="email"]').should('exist');
    cy.get('input[formControlName="password"]').should('exist');
    cy.get('button[type="submit"]').should('exist');
  });

  it('should register successfully and redirect to feed', () => {
    const unique = Date.now();
    cy.get('input[formControlName="username"]').type(`user${unique}`, { force: true });
    cy.get('input[formControlName="email"]').type(`user${unique}@test.com`, { force: true });
    cy.get('input[formControlName="password"]').type('Test@1234', { force: true });
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/feed');
  });

  it('should show an error when email is already taken', () => {
    cy.get('input[formControlName="username"]').type('nouveaunom', { force: true });
    cy.get('input[formControlName="email"]').type('alice@example.com', { force: true });
    cy.get('input[formControlName="password"]').type('Test@1234', { force: true });
    cy.get('button[type="submit"]').click();
    cy.get('.server-error').should('be.visible');
    cy.url().should('include', '/register');
  });

  it('should show validation errors for a weak password', () => {
    cy.get('input[formControlName="username"]').type('testuser', { force: true });
    cy.get('input[formControlName="email"]').type('testuser@test.com', { force: true });
    cy.get('input[formControlName="password"]').type('simple', { force: true });
    cy.get('.password-criteria .invalid').should('have.length.at.least', 1);
  });

  it('should show validation errors when fields are empty', () => {
    cy.get('button[type="submit"]').should('be.disabled');
  });
});
