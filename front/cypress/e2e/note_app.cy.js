describe('Note app', function () {
  beforeEach(function () {
    cy.request('POST', 'http://localhost:3001/api/testing/reset');
    const user = {
      name: 'Kevin M',
      username: 'kevinm',
      password: 'sekretpassword',
    };
    cy.request('POST', 'http://localhost:3001/api/users/', user);
    cy.visit('http://localhost:5173');
  });

  it('front page can be opened', function () {
    cy.contains('Notes');
    cy.contains(
      'Note app, Department of Computer Science, University of Helsinki 2023',
    );
  });

  it('user can log in', function () {
    cy.contains('log in').click();
    cy.get('#username').type('kevinm');
    cy.get('#password').type('sekretpassword');
    cy.get('#login-button').click();

    cy.contains('Kevin M logged in');
  });

  it.only('login fail if password is wrong', function () {
    cy.contains('log in').click();
    cy.get('#username').type('kevinm');
    cy.get('#password').type('wrongpassword');
    cy.get('#login-button').click();

    cy.get('.error').contains('wrong credentials');
  });

  describe('when logged in', function () {
    this.beforeEach(function () {
      cy.contains('log in').click();
      cy.get('#username').type('kevinm');
      cy.get('#password').type('sekretpassword');
      cy.get('#login-button').click();
    });

    it('a new note can be created', function () {
      cy.contains('new note').click();
      cy.get('#note-input').type('a note created by cypress');
      cy.contains('save').click();
      cy.contains('a note created by cypress');
    });

    describe('and a note exists', function () {
      beforeEach(function () {
        cy.contains('new note').click();
        cy.get('#note-input').type('another note cypress');
        cy.contains('save').click();
      });

      it('it can be made not important', function () {
        cy.contains('another note cypress')
          .contains('make not important')
          .click();

        cy.contains('another note cypress').contains('make important');
      });
    });
  });
});
