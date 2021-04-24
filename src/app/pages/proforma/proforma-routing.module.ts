import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProformaViewComponent } from './proforma-view/proforma-view.component';
import { ProformaComponent } from './proforma.component';
import { NewProformaComponent } from './new-proforma/new-proforma.component';

const routes: Routes = [
  {
    path: '',
    component: ProformaComponent
  },
  {
    path: 'new-proforma',
    component: NewProformaComponent
  },
  {
    path: ':proformaId/view',
    component: ProformaViewComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProformaRoutingModule { }
