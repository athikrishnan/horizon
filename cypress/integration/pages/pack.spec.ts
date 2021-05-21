/// <reference types="cypress" />

import { Pack } from 'src/app/models/pack.model';
import { PackFormPage } from '../page-objects/pack-form.po';
import { PackPage } from '../page-objects/pack.po';

describe('Pack page tests', () => {
  const pack = {
    name: 'Test Pack',
    count: 12
  } as Pack;
  const packPage = new PackPage();
  const packFormPage = new PackFormPage();

  beforeEach(() => {
    cy.login();
  });

  it('should be able to add new pack', () => {
    packPage.navigate();
    packPage.gotoPackForm();
    cy.location('pathname').should('include', packFormPage.getCreateRoute());

    packFormPage.addPack(pack);

    packPage.navigate();
    packPage.editPack(pack);
    cy.location('pathname').should('match', new RegExp(packFormPage.getEditRoute()));

    packFormPage.deletePack();
  });
});
