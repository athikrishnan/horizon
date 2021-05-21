/// <reference types="cypress" />

describe('My First Test', () => {
  beforeEach(() => {
    cy.login();
  });

  it('Visits the dashboard page', () => {
    cy.visit('/dashboard');
    cy.contains('Today\'s Total').should('be.visible');
    cy.contains('Active Invoices').should('be.visible');
    cy.get('mat-icon').should('contain', 'add');
    cy.get('div.spinner').should('not.exist');
  });
});
