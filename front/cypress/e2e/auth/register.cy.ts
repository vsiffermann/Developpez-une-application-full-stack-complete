describe('Register', () => {
  beforeEach(() => {
    cy.visit('/register');
  });

  it('should display the register form', () => {
    // given the user visits /register, when the page loads, then the form with username, email and password fields is visible
  });

  it('should register successfully and redirect to feed', () => {
    // given valid unique credentials, when the form is submitted, then the user is redirected to /feed
  });

  it('should show an error when email is already taken', () => {
    // given an email already registered, when the form is submitted, then an error message is displayed
  });

  it('should show validation errors for a weak password', () => {
    // given a password that does not meet the requirements, when the form is submitted, then inline validation errors are shown
  });

  it('should show validation errors when fields are empty', () => {
    // given the form is submitted without filling any field, then required field errors are displayed
  });
});
