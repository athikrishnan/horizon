/// <reference types="cypress" />

import { Pack } from 'src/app/models/pack.model';

describe('Pack page tests', () => {
  const pack = {
    name: 'Test Pack',
    count: 12
  } as Pack;

  beforeEach(() => {
    cy.login();
  });

  it('should be able to add new pack', () => {
    cy.visit('/pack');
    cy.get('a[href="/pack/create"]').click();
    cy.location('pathname').should('include', 'pack/create');

    cy.get('input[formcontrolname="name"]').type(pack.name);
    cy.get('input[formcontrolname="count"]').type(pack.count.toString());
    cy.contains('Save').click();

    cy.visit('/pack');
    cy.contains('Test Pack').click();
    cy.location('pathname').should('include', 'pack');
    cy.location('pathname').should('include', 'edit');
    cy.contains('Delete').click();
    cy.contains('Continue Delete').click();
  });
});
