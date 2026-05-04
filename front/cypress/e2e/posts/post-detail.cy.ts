describe('Post Detail', () => {
  beforeEach(() => {
    cy.loginAsTestUser();
  });

  const visitFirstPost = () => {
    cy.visit('/feed');
    cy.get('.post-card').first().click();
    cy.url().should('match', /\/posts\/\d+/);
  };

  it('should display the post title, author, topic and content', () => {
    visitFirstPost();
    cy.get('article h1').should('be.visible');
    cy.get('.post-meta').should('be.visible');
    cy.get('.topic-badge').should('be.visible');
    cy.get('.post-content').should('be.visible');
  });

  it('should display the comments section', () => {
    visitFirstPost();
    cy.get('.comments-section').should('be.visible');
    cy.get('h2').contains(/commentaire/i).should('be.visible');
  });

  it('should add a comment and display it in the list', () => {
    visitFirstPost();
    const commentText = `Commentaire Cypress ${Date.now()}`;
    cy.get('.comment-form textarea').type(commentText, { force: true });
    cy.get('.comment-form button').click();
    cy.contains(commentText).should('be.visible');
  });

  it('should keep the send button disabled when comment is empty', () => {
    visitFirstPost();
    cy.get('.comment-form button').should('be.disabled');
  });

  it('should navigate back on back button click', () => {
    visitFirstPost();
    cy.contains('button', /retour/i).click();
    cy.url().should('include', '/feed');
  });
});
