describe('Profile', () => {
  beforeEach(() => {
    cy.loginAsTestUser();
    cy.visit('/profile');
  });

  it('should display current user email and username', () => {
    // given an authenticated user, when the profile page loads, then the current email and username are displayed in the form
  });

  it('should update username successfully', () => {
    // given a new unique username, when the form is submitted, then a success message is shown and the username is updated
  });

  it('should show an error when the new email is already taken', () => {
    // given an email already used by another account, when the form is submitted, then an error message is displayed
  });

  it('should display subscribed topics', () => {
    // given a user subscribed to topics, when the profile page loads, then the subscribed topics are listed in the subscriptions section
  });

  it('should unsubscribe from a topic from the profile page', () => {
    // given a subscribed topic in the list, when the unsubscribe button is clicked, then the topic is removed from the subscriptions list
  });

  it('should logout and redirect to home', () => {
    // given an authenticated user on the profile page, when the logout button is clicked, then the token is cleared and the user is redirected to /
  });
});
