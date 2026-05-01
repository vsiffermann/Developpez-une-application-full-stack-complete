describe('Topics', () => {
  beforeEach(() => {
    cy.loginAsTestUser();
    cy.visit('/topics');
  });

  it('should display the list of all topics', () => {
    // given topics exist in the database, when the topics page loads, then all topic cards are visible
  });

  it('should show a subscribe button for unsubscribed topics', () => {
    // given the user is not subscribed to a topic, when the page loads, then the button label is "S'abonner"
  });

  it('should subscribe to a topic and update the button', () => {
    // given the user is not subscribed to a topic, when the subscribe button is clicked, then the button changes to "Se désabonner"
  });

  it('should unsubscribe from a topic and update the button', () => {
    // given the user is already subscribed to a topic, when the button is clicked, then the button changes back to "S'abonner"
  });
});
