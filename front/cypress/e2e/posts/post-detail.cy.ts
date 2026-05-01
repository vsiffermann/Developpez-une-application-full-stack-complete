describe('Post Detail', () => {
  beforeEach(() => {
    cy.loginAsTestUser();
  });

  it('should display the post title, author, topic and content', () => {
    // given an existing post id, when the user visits /posts/:id, then the title, author username, topic name and content are visible
  });

  it('should display existing comments', () => {
    // given a post with comments, when the detail page loads, then all comments with their author and content are displayed
  });

  it('should add a comment and display it in the list', () => {
    // given the post detail page, when the user types a comment and submits, then the new comment appears at the bottom of the list
  });

  it('should not submit an empty comment', () => {
    // given the comment field is empty, when the submit button is clicked, then no comment is added
  });

  it('should navigate back to feed on back button click', () => {
    // given the post detail page, when the back button is clicked, then the user is navigated to /feed
  });
});
