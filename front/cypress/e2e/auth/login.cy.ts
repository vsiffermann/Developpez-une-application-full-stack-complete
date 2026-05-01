describe('Login', () => {
  beforeEach(() => {
    cy.visit('/login');
  });

  it('should display the login form', () => {
    // given the user visits /login, when the page loads, then the identifier and password fields are visible
  });

  it('should login with email and redirect to feed', () => {
    // given a registered user's email and password, when the form is submitted, then the user is redirected to /feed
  });

  it('should login with username and redirect to feed', () => {
    // given a registered user's username and password, when the form is submitted, then the user is redirected to /feed
  });

  it('should show an error for wrong password', () => {
    // given a valid email and an incorrect password, when the form is submitted, then an error message is displayed
  });

  it('should redirect to /feed if already authenticated', () => {
    // given the user has a valid token in localStorage, when the user visits /login, then they are redirected to /feed
  });
});
