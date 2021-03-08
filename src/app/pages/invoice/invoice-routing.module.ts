import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClientSelectionComponent } from './client-selection/client-selection.component';
import { InvoiceComponent } from './invoice.component';

const routes: Routes = [
  {
    path: '',
    component: InvoiceComponent
  },
  {
    path: 'active-invoice/:id/client-selection',
    component: ClientSelectionComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InvoiceRoutingModule { }
