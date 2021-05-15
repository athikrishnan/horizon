describe('My First Test', () => {
  beforeEach(() => {
    indexedDB.deleteDatabase('firebaseLocalStorageDb');
  })
  
  it('Visits the login page', () => {
    cy.visit('https://localhost:4200/login')
    cy.contains('login').click()
    cy.contains('Algae Peach').click()
  })
})