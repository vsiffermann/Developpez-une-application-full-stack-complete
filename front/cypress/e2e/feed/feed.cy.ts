describe('Feed', () => {
  beforeEach(() => {
    cy.loginAsTestUser();
    cy.visit('/feed');
  });

  it('should display the list of posts from subscribed topics', () => {
    // given a user subscribed to topics that have posts, when the feed page loads, then a list of post cards is visible
  });

  it('should display an empty state when user has no subscriptions', () => {
    // given a user with no subscriptions, when the feed loads, then an empty state message is displayed
  });

  it('should sort posts in ascending order', () => {
    // given multiple posts in the feed, when the user selects ascending sort, then the oldest post appears first
  });

  it('should sort posts in descending order', () => {
    // given multiple posts in the feed, when the user selects descending sort, then the newest post appears first
  });

  it('should navigate to post detail on card click', () => {
    // given at least one post in the feed, when the user clicks on a post card, then they are navigated to /posts/:id
  });

  it('should navigate to create post page', () => {
    // given the feed page, when the user clicks "Créer un article", then they are navigated to /posts/new
  });
});
