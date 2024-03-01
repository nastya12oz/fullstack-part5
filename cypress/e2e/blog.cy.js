describe('Blog app', function() {
  beforeEach(function() {
    cy.visit('http://localhost:5173')
  })

  it('Login form is shown', function() {
    cy.contains('blogs')
  })

  it('login form can be opened', function() {
    cy.contains('login').click()
  })

  it('user can log in', function() {
    cy.contains('login').click()
    cy.get('#username').type('Masha')
    cy.get('#password').type('test')
    cy.get('#login-button').click()

    cy.contains('Masha is logged in')
  })

  it('fails with wrong credentials and red light', function() {
    cy.contains('login').click()
    cy.get('#username').type('Sasha')
    cy.get('#password').type('pest')
    cy.get('#login-button').click()

    cy.get('#notification')
      .should('contain', 'Wrong')
      .and('have.css', 'color', 'rgb(255, 0, 0)')
  })

  it('a new blog can be created', function() {
    cy.contains('login').click()
    cy.get('#username').type('Masha')
    cy.get('#password').type('test')
    cy.get('#login-button').click()

    cy.contains('Masha is logged in').should('be.visible')

    cy.contains('create new blog').click()
    cy.get('#title').type('Cypress title')
    cy.get('#author').type('Cypress author')
    cy.get('#url').type('Cypress url')
    cy.contains('add').click()

    cy.contains('Cypress title')
    cy.contains('Cypress author')
    cy.contains('Cypress url')
  })

  it('user can like a blog', function() {
    cy.contains('login').click()
    cy.get('#username').type('Masha')
    cy.get('#password').type('test')
    cy.get('#login-button').click()

    cy.contains('Masha is logged in').should('be.visible')
    cy.contains('Cypress title').parents('.single-blog').contains('show more').click()
    cy.contains('Cypress title').parents('.single-blog').find('button').contains('like').click()

    cy.contains('Cypress title').parents('.single-blog').find('#likesCount').should('contain', '1')
  })

  it('user who created a blog can delete it', function() {
    cy.contains('login').click()
    cy.get('#username').type('Nastya')
    cy.get('#password').type('nastya')
    cy.get('#login-button').click()

    cy.contains('Nastya is logged in').should('be.visible')

    cy.contains('create new blog').click()
    cy.get('#title').type('blyat')
    cy.get('#author').type('blyat')
    cy.get('#url').type('blyat')
    cy.contains('add').click()

    cy.contains('title blyat').parent().contains('show more').click()
    cy.contains('title blyat').parent().contains('remove').click()

    cy.on('window:confirm', () => true)

    cy.contains('blyat').should('not.exist')
  })

  it('only the creator can see the delete button of a blog', function() {
    cy.contains('login').click()
    cy.get('#username').type('Masha')
    cy.get('#password').type('test')
    cy.get('#login-button').click()

    cy.contains('Masha is logged in').should('be.visible')

    cy.contains('create new blog').click()
    cy.get('#title').type('Unique title by Masha')
    cy.get('#author').type('Masha')
    cy.get('#url').type('http://masha.com')
    cy.contains('add').click()

    cy.contains('Unique title by Masha').parent().contains('show more').click()
    cy.contains('Unique title by Masha').parent().contains('remove').should('be.visible')

    cy.contains('logout').click()
    cy.contains('login').should('be.visible')

    cy.clearLocalStorage()
    cy.clearCookies()

    cy.contains('login').click()
    cy.get('#username').type('Nastya')
    cy.get('#password').type('nastya')
    cy.get('#login-button').click()

    cy.contains('Nastya is logged in').should('be.visible')

    cy.contains('Unique title by Masha').parent().contains('show more').click()
    cy.contains('Unique title by Masha').parent().should('not.contain', 'remove')
  })

  it('blogs are ordered by likes with the most liked blog first', function() {
    cy.contains('login').click()
    cy.get('#username').type('Masha')
    cy.get('#password').type('test')
    cy.get('#login-button').click()

    cy.contains('Masha is logged in').should('be.visible')

    cy.visit('http://localhost:5173')

    cy.get('.single-blog').should('have.length.at.least', 1)

    cy.get('.single-blog').then(blogElements => {
      const likesArray = [...blogElements].map(blog => Number(blog.dataset.likes))

      const sortedLikes = [...likesArray].sort((a, b) => b - a)

      for (let i = 0; i < likesArray.length; i++) {
        expect(likesArray[i]).to.equal(sortedLikes[i])
      }
    })
  })


})
