describe('Topics', () => {
  beforeEach(() => {
    cy.loginAsTestUser();
    cy.visit('/topics');
  });

  it('should display the list of all topics', () => {
    cy.get('mat-card.topic-card').should('have.length', 5);
  });

  it('should show subscribe and unsubscribe buttons depending on subscriptions', () => {
    // alice est abonnée à JS + Python → boutons warn ; les autres → boutons primary
    cy.get('mat-card.topic-card button[color="primary"]').should('have.length.at.least', 1);
    cy.get('mat-card.topic-card button[color="warn"]').should('have.length.at.least', 1);
  });

  it('should subscribe to a topic and update the button', () => {
    cy.contains('mat-card.topic-card', 'Web3')
      .find('button[color="primary"]')
      .click();
    cy.contains('mat-card.topic-card', 'Web3')
      .find('button[color="warn"]')
      .should('be.visible');
    // Nettoyage
    cy.contains('mat-card.topic-card', 'Web3')
      .find('button[color="warn"]')
      .click();
  });

  it('should unsubscribe from a topic and update the button', () => {
    cy.contains('mat-card.topic-card', 'JavaScript')
      .find('button[color="warn"]')
      .click();
    cy.contains('mat-card.topic-card', 'JavaScript')
      .find('button[color="primary"]')
      .should('be.visible');
    // Nettoyage
    cy.contains('mat-card.topic-card', 'JavaScript')
      .find('button[color="primary"]')
      .click();
  });
});
