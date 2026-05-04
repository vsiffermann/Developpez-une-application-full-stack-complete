describe('Feed', () => {
  beforeEach(() => {
    cy.loginAsTestUser();
    cy.visit('/feed');
  });

  it('should display the list of posts from subscribed topics', () => {
    cy.get('.post-card').should('have.length.at.least', 1);
  });

  it('should display an empty state when user has no subscriptions', () => {
    const unique = Date.now();
    cy.request('POST', '/api/auth/register', {
      email: `fresh${unique}@test.com`,
      username: `fresh${unique}`,
      password: 'Test@1234',
    }).then((res) => {
      localStorage.setItem('mdd_token', res.body.token);
    });
    cy.visit('/feed');
    cy.get('.empty-state').should('be.visible');
  });

  it('should switch to ascending sort order', () => {
    cy.get('.post-card').should('have.length.at.least', 2);
    // En état initial (desc), le bouton affiche "Plus récent" — cliquer bascule en asc
    cy.contains('button', /plus récent/i).click();
    cy.contains('button', /plus ancien/i).should('be.visible');
  });

  it('should switch back to descending sort order', () => {
    cy.get('.post-card').should('have.length.at.least', 2);
    cy.contains('button', /plus récent/i).click();
    cy.contains('button', /plus ancien/i).click();
    cy.contains('button', /plus récent/i).should('be.visible');
  });

  it('should navigate to post detail on card click', () => {
    cy.get('.post-card').first().click();
    cy.url().should('match', /\/posts\/\d+/);
  });

  it('should navigate to create post page', () => {
    cy.contains('button', /créer un article/i).click();
    cy.url().should('include', '/posts/new');
  });
});
