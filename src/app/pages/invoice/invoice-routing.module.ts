import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InvoiceViewComponent } from './invoice-view/invoice-view.component';
import { InvoiceComponent } from './invoice.component';
import { NewInvoiceComponent } from './new-invoice/new-invoice.component';

const routes: Routes = [
  {
    path: '',
    component: InvoiceComponent
  },
  {
    path: 'new-invoice',
    component: NewInvoiceComponent
  },
  {
    path: ':invoiceId/view',
    component: InvoiceViewComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InvoiceRoutingModule { }
