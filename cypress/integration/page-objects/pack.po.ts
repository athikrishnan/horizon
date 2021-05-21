import { Pack } from '../../../src/app/models/pack.model';

export class PackPage {
  navigate(): void {
    cy.visit('/pack');
  }

  gotoPackForm(): void {
    this.getNewPackButton().click();
  }

  getNewPackButton(): any {
    return cy.get('a[href="/pack/create"]');
  }

  editPack(pack: Pack): void {
    cy.contains(pack.name).click();
  }
}
