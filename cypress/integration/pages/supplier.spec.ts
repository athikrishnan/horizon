/// <reference types="cypress" />

import { Supplier } from '../../../src/app/models/supplier.model';
import { SupplierFormPage } from '../page-objects/supplier-form.po';
import { SupplierPage } from '../page-objects/supplier.po';

describe('supplier page tests', () => {
  const supplierPage = new SupplierPage();
  const supplierFormPage = new SupplierFormPage();

  const supplier = {
    name: 'Test Supplier',
    location: 'Test Location',
    phone: '9876543210',
    email: 'supplier@test.com'
  } as Supplier;

  before(() => {
    cy.login();
    supplierPage.visit();
  });

  beforeEach(() => {
    supplierPage.navigate();
  });

  it('should be able to naviagte to new supplier page', () => {
    supplierPage.gotoSupplierForm();
    cy.location('pathname').should('include', supplierFormPage.getCreateRoute());

    supplierFormPage.getCancelButton().click();
    cy.location('pathname').should('include', supplierPage.getRoute());
  });

  it('should have the validations when saving supplier', () => {
    supplierPage.gotoSupplierForm();
    supplierFormPage.getSaveButton().should('be.disabled');

    supplierFormPage.getNameInput().type(supplier.name).clear().trigger('blur');
    cy.get('mat-error').should('contain', 'Required');
    supplierFormPage.getNameInput().type(supplier.name);
    supplierFormPage.getSaveButton().should('be.disabled');

    supplierFormPage.getLocationInput().type(supplier.location).clear().trigger('blur');
    cy.get('mat-error').should('contain', 'Required');
    supplierFormPage.getLocationInput().type(supplier.location);
    supplierFormPage.getSaveButton().should('be.disabled');

    supplierFormPage.getPhoneInput().type(supplier.phone).clear().trigger('blur');
    cy.get('mat-error').should('contain', 'Required');
    supplierFormPage.getPhoneInput().type(supplier.phone);
    supplierFormPage.getSaveButton().should('be.enabled');

    supplierFormPage.getEmailInput().type('invalid email').trigger('blur');
    cy.get('mat-error').should('contain', 'Invalid');
    supplierFormPage.getSaveButton().should('be.disabled');

    supplierFormPage.getEmailInput().clear().type(supplier.email).trigger('blur');
    supplierFormPage.getSaveButton().should('be.enabled');
  });

  it('should be able to add, edit, delete supplier', () => {
    supplierPage.gotoSupplierForm();
    supplierFormPage.addSupplier(supplier);

    supplierPage.editSupplier(supplier);
    cy.location('pathname').should('match', new RegExp(supplierFormPage.getEditRoute()));

    supplierFormPage.deleteSupplier();
  });
});
