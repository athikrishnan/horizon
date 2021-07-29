import { Supplier } from '../../../src/app/models/supplier.model';

export class SupplierFormPage {
  getCreateRoute(): string {
    return '/supplier/create';
  }

  getEditRoute(): string {
    return 'supplier.*edit';
  }

  setName(name: string): void {
    this.getNameInput().type(name);
  }

  getNameInput(): any {
    return cy.get('input[formcontrolname="name"]');
  }

  setLocation(location: string): void {
    this.getLocationInput().type(location);
  }

  getLocationInput(): any {
    return cy.get('input[formcontrolname="location"]');
  }

  setPhone(phone: string): void {
    this.getPhoneInput().type(phone);
  }

  getPhoneInput(): any {
    return cy.get('input[formcontrolname="phone"]');
  }

  setEmail(phone: string): void {
    this.getEmailInput().type(phone);
  }

  getEmailInput(): any {
    return cy.get('input[formcontrolname="email"]');
  }

  save(): void {
    this.getSaveButton().click();
  }

  getSaveButton(): any {
    return cy.contains('Save');
  }

  getCancelButton(): any {
    return cy.contains('Cancel');
  }

  addSupplier(supplier: Supplier): void {
    this.setName(supplier.name);
    this.setLocation(supplier.location);
    this.setPhone(supplier.phone);
    this.setEmail(supplier.email);
    this.save();
  }

  deleteSupplier(): void {
    cy.contains('Delete').click();
    cy.contains('Continue Delete').click();
  }
}
