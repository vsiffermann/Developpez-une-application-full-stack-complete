describe('Profile', () => {
  beforeEach(() => {
    cy.loginAsTestUser();
    cy.visit('/profile');
  });

  it('should display current user email and username', () => {
    cy.get('input[formControlName="email"]').should('have.value', 'alice@example.com');
    cy.get('input[formControlName="username"]').should('have.value', 'alice');
  });

  it('should update username successfully and stay on profile', () => {
    const newUsername = `alice_${Date.now()}`;
    cy.get('input[formControlName="username"]').clear().type(newUsername, { force: true });
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/profile');
    // Nettoyage : remettre le username original
    cy.get('input[formControlName="username"]').clear().type('alice', { force: true });
    cy.get('button[type="submit"]').click();
  });

  it('should show an error when the new email is already taken', () => {
    cy.get('input[formControlName="email"]').clear().type('bob@example.com', { force: true });
    cy.get('button[type="submit"]').click();
    cy.get('.server-error').should('be.visible');
  });

  it('should display subscribed topics', () => {
    cy.get('.subscriptions-section').should('be.visible');
    cy.get('.subscriptions-section').contains(/javascript/i).should('be.visible');
    cy.get('.subscriptions-section').contains(/python/i).should('be.visible');
  });

  it('should unsubscribe from a topic from the profile page', () => {
    cy.contains('mat-card.subscription-card', /python/i)
      .contains('button', /se désabonner/i)
      .click();
    cy.get('.subscriptions-section').contains(/python/i).should('not.exist');
    // Nettoyage : se réabonner depuis la page topics
    cy.visit('/topics');
    cy.contains('mat-card', /python/i)
      .contains('button', /s'abonner/i)
      .click();
  });

  it('should logout and redirect to login', () => {
    cy.contains('button', /se déconnecter/i).click();
    cy.url().should('include', '/login');
  });
});
