import { Pack } from '../../../src/app/models/pack.model';

export class PackFormPage {
  getCreateRoute(): string {
    return '/pack/create';
  }

  getEditRoute(): string {
    return 'pack.*edit';
  }

  setName(name: string): void {
    this.getNameInput().type(name);
  }

  getNameInput(): any {
    return cy.get('input[formcontrolname="name"]');
  }

  setCount(count: string): void {
    this.getCountInput().type(count);
  }

  getCountInput(): any {
    return cy.get('input[formcontrolname="count"]');
  }

  save(): void {
    this.getSaveButton().click();
  }

  getSaveButton(): any {
    return cy.contains('Save');
  }

  addPack(pack: Pack): void {
    this.setName(pack.name);
    this.setCount(pack.count.toString());
    this.save();
  }

  deletePack(): void {
    cy.contains('Delete').click();
    cy.contains('Continue Delete').click();
  }
}
