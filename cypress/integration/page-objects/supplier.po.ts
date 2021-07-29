import { Supplier } from '../../../src/app/models/supplier.model';

export class SupplierPage {
  getRoute(): string {
    return '/supplier';
  }

  visit(): void {
    cy.visit('/supplier');
  }

  navigate(): void {
    cy.get('mat-icon').contains('menu').click();
    cy.get('mat-expansion-panel-header').contains('Resources').click();
    cy.get('a.mat-list-item[routerLink="/supplier"]').click();
  }

  gotoSupplierForm(): void {
    this.getNewSupplierButton().click();
  }

  getNewSupplierButton(): any {
    return cy.get('a[href="/supplier/create"]');
  }

  editSupplier(supplier: Supplier): void {
    cy.contains(supplier.name).click();
  }
}
