describe('Create Post', () => {
  beforeEach(() => {
    cy.loginAsTestUser();
    cy.visit('/posts/new');
  });

  it('should display the create post form', () => {
    // given the user visits /posts/new, when the page loads, then title, topic and content fields are visible
  });

  it('should create a post and redirect to its detail page', () => {
    // given valid title, topic and content, when the form is submitted, then the user is redirected to /posts/:id with the new post displayed
  });

  it('should show validation errors when fields are empty', () => {
    // given the form is submitted without filling any field, then required field errors are displayed
  });

  it('should list available topics in the topic selector', () => {
    // given topics exist in the database, when the topic field is opened, then all available topics are listed
  });
});
