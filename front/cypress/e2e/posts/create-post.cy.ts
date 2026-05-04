describe('Create Post', () => {
  beforeEach(() => {
    cy.loginAsTestUser();
    cy.visit('/posts/new');
  });

  it('should display the create post form', () => {
    cy.get('input[formControlName="title"]').should('exist');
    cy.get('mat-select[formControlName="topicId"]').should('exist');
    cy.get('textarea[formControlName="content"]').should('exist');
    cy.get('button[type="submit"]').should('exist');
  });

  it('should create a post and redirect to its detail page', () => {
    cy.get('input[formControlName="title"]').type('Mon article de test Cypress', { force: true });
    cy.get('mat-select[formControlName="topicId"]').click();
    cy.get('mat-option').first().click();
    cy.get('textarea[formControlName="content"]').type("Contenu de test généré par Cypress.", { force: true });
    cy.get('button[type="submit"]').click();
    cy.url().should('match', /\/posts\/\d+/);
    cy.contains('Mon article de test Cypress').should('be.visible');
  });

  it('should keep submit button disabled when fields are empty', () => {
    cy.get('button[type="submit"]').should('be.disabled');
  });

  it('should list available topics in the topic selector', () => {
    cy.get('mat-select[formControlName="topicId"]').click();
    cy.get('mat-option').should('have.length', 5);
    cy.get('mat-option').should('contain', 'JavaScript');
  });
});
